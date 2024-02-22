mod manifest;
mod template;
mod util;

use anyhow::{bail, Context, Result};
use globset::{Glob, GlobSet, GlobSetBuilder};
use regex::Regex;
use std::io::Cursor;
use std::path::{Path, PathBuf};
use std::time::Instant;
use std::{env, fs};
pub use template::Template;
use zip::ZipArchive;

pub struct Project {
  pub name: String,
  pub description: Option<String>,
  pub force: bool,
  pub template: Template,
}

impl Project {
  /// <https://regex101.com/r/9dSatE>
  const NAME_REGEX: &'static str = r"^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$";

  /// Create a new Manatsu project from a template.
  ///
  /// Tauri: <https://github.com/tsukilabs/template-tauri>
  ///
  /// Vue: <https://github.com/tsukilabs/template-vue>
  pub async fn create(&self) -> Result<()> {
    let start = Instant::now();

    if !is_valid(&self.name)? {
      bail!("Invalid project name: {}", self.name);
    }

    let path = env::current_dir()?.join(&self.name);
    if path.try_exists()? {
      if self.force {
        fs::remove_dir_all(&path)?
      } else {
        bail!("Directory already exists: {}", path.display());
      }
    }

    println!("Downloading template...");
    let bytes = self.template.download().await?;

    println!("Building project...");
    fs::create_dir_all(&path).with_context(|| "Could not create project folder")?;

    let cursor = Cursor::new(bytes);
    let mut zip = ZipArchive::new(cursor)?;
    zip.extract(&path)?;

    hoist_extracted_files(&path, self.template)?;
    update_project_metadata(&path, self)?;

    println!("Built {} in {:?}", self.name, start.elapsed());
    Ok(())
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

  bail!("Could not find extracted folder")
}

fn build_globset() -> Result<GlobSet> {
  let mut builder = GlobSetBuilder::new();

  macro_rules! add {
    ($glob:expr) => {
      builder.add(Glob::new($glob)?);
    };
  }

  // Directories
  add!("**/dist");
  add!("**/target");
  add!("**/node_modules");
  add!("**/.github");

  // Files
  add!("**/LICENSE");
  add!("**/README.md");
  add!("**/pnpm-lock.yaml");
  add!("**/*.lock");
  add!("**/*.log");
  add!("**/taze.config.*");
  add!("**/config.json");

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

fn update_project_metadata(dir_path: &Path, project: &Project) -> Result<()> {
  manifest::update_package_json(dir_path, project)?;

  if matches!(&project.template, Template::Tauri) {
    manifest::update_cargo_toml(dir_path, project)?;
    manifest::update_tauri_conf(dir_path, project)?;
  }

  util::update_index_metadata(dir_path, &project.name)?;

  Ok(())
}

/// Determines whether the project name is valid.
pub fn is_valid<T: AsRef<str>>(project_name: T) -> Result<bool> {
  let project_name = project_name.as_ref();
  let regex = Regex::new(Project::NAME_REGEX)?;
  Ok(regex.is_match(project_name))
}

#[cfg(test)]
mod tests {
  use super::is_valid;

  #[test]
  fn should_determine_if_name_is_valid() {
    let name = "my-project";
    assert!(is_valid(name).unwrap());

    let name = "真夏";
    assert!(!is_valid(name).unwrap());
  }
}
