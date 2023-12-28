pub mod template;

use anyhow::{anyhow, Context, Result};
use globset::{Glob, GlobSet, GlobSetBuilder};
use regex::Regex;
use std::io::{Cursor, Read};
use std::path::{Path, PathBuf};
use std::time::Duration;
use std::{env, fs};
use template::Template;
use ureq::Response;
use zip::ZipArchive;

/// <https://regex101.com/r/9dSatE>
pub const PROJECT_NAME_REGEX: &str = r"^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$";

pub struct Project<'a> {
  pub name: &'a str,
  pub description: Option<&'a str>,
  pub force: bool,
  pub template: Template,
}

/// Create a new Manatsu project from a template.
///
/// Vue: <https://github.com/manatsujs/template-vue>
pub fn create(project: Project) -> Result<()> {
  if !is_valid_name(project.name)? {
    return Err(anyhow!("Invalid project name: {}", project.name));
  }

  let path = env::current_dir()?.join(project.name);
  if path.try_exists()? {
    if project.force {
      fs::remove_dir_all(&path)?
    } else {
      return Err(anyhow!("Directory already exists: {}", path.display()));
    }
  }

  println!("Downloading template...");
  let bytes = download_template(project.template)?;

  println!("Building project...");
  fs::create_dir_all(&path).with_context(|| "Could not create project folder")?;

  let cursor = Cursor::new(bytes);
  let mut zip = ZipArchive::new(cursor)?;
  zip.extract(&path)?;
  hoist_extracted_files(&path, project.template)?;

  println!("Project built: {}", project.name);
  Ok(())
}

/// Download a Manatsu template as bytes.
pub fn download_template(template: Template) -> Result<Vec<u8>> {
  let template_url = template.url();
  let response = ureq::get(&template_url)
    .timeout(Duration::from_secs(10))
    .call()
    .with_context(|| format!("Could not fetch: {}", template_url))?;

  let mut bytes = create_bytes_vec(&response)?;
  response
    .into_reader()
    .take(10_000_000)
    .read_to_end(&mut bytes)?;

  Ok(bytes)
}

fn create_bytes_vec(response: &Response) -> Result<Vec<u8>> {
  let header_name = "content-length";
  if response.has(header_name) {
    let len: usize = response
      .header(header_name)
      .ok_or(anyhow!("Header unavailable: {}", header_name))?
      .parse()
      .with_context(|| format!("Could not parse header: {}", header_name))?;

    Ok(Vec::with_capacity(len))
  } else {
    Ok(Vec::with_capacity(100_000))
  }
}

fn hoist_extracted_files(path: &Path, template: Template) -> Result<()> {
  let globset = build_globset()?;
  let extracted_folder = find_extracted_folder(path, template)?;

  for entry in fs::read_dir(&extracted_folder)?.flatten() {
    let src_path = entry.path();
    let target_path = path.join(entry.file_name());

    if globset.is_match(&src_path) {
      remove_entry(&src_path)?;
    } else {
      fs::rename(&src_path, target_path)?;
    }
  }

  fs::remove_dir_all(extracted_folder)?;
  Ok(())
}

fn find_extracted_folder(path: &Path, template: Template) -> Result<PathBuf> {
  let template_name: &str = template.into();
  for entry in fs::read_dir(path)? {
    let entry = entry?;
    let metadata = entry.metadata()?;
    let entry_path = entry.path();

    if metadata.is_dir() {
      let file_name = entry.file_name();
      if matches!(file_name.to_str(), Some(n) if n.contains(template_name)) {
        return Ok(entry_path);
      }
    }

    remove_entry(&entry_path)?;
  }

  Err(anyhow!("Could not find extracted folder"))
}

fn build_globset() -> Result<GlobSet> {
  let mut builder = GlobSetBuilder::new();

  builder.add(Glob::new("**/node_modules")?);
  builder.add(Glob::new("**/dist")?);
  builder.add(Glob::new("**/.github")?);
  builder.add(Glob::new("**/LICENSE")?);
  builder.add(Glob::new("**/README.md")?);
  builder.add(Glob::new("**/pnpm-lock.yaml")?);
  builder.add(Glob::new("**/*.log")?);
  builder.add(Glob::new("**/config.json")?);

  let globset = builder.build()?;
  Ok(globset)
}

fn remove_entry(path: &Path) -> Result<()> {
  let metadata = path.metadata()?;
  if metadata.is_dir() {
    fs::remove_dir_all(path)?;
  } else if metadata.is_file() {
    fs::remove_file(path)?;
  }

  Ok(())
}

/// Determines whether the project name is valid.
///
/// # Examples
/// ```
/// use manatsu::project::is_valid_name;
///
/// let name = "my-project";
/// assert!(is_valid_name(name).unwrap());
///
/// let name = "真夏";
/// assert!(!is_valid_name(name).unwrap());
/// ```
pub fn is_valid_name(project_name: &str) -> Result<bool> {
  let regex = Regex::new(PROJECT_NAME_REGEX)?;
  Ok(regex.is_match(project_name))
}

#[cfg(test)]
mod tests {
  use crate::project::template::Template;

  #[test]
  fn should_return_status_200() {
    let template_url = Template::Vue.url();
    let response = ureq::get(&template_url).call().unwrap();
    assert_eq!(200, response.status());
  }
}