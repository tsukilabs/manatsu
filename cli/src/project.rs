pub mod template;

use anyhow::{anyhow, Context, Result};
use regex::Regex;
use std::io::{Cursor, Read};
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
  match path.try_exists()? {
    true if project.force => fs::remove_dir_all(&path)?,
    _ => return Err(anyhow!("Directory already exists: {}", path.display())),
  }

  println!("Downloading template...");
  let template_url = project.template.url();
  let response = ureq::get(&template_url)
    .timeout(Duration::from_secs(10))
    .call()
    .with_context(|| format!("Could not fetch: {}", template_url))?;

  let mut bytes = create_bytes_vec(&response)?;
  response
    .into_reader()
    .take(10_000_000)
    .read_to_end(&mut bytes)?;

  println!("Creating project: {}", project.name);
  fs::create_dir_all(&path).with_context(|| "Could not create project folder")?;

  let cursor = Cursor::new(bytes);
  let mut zip = ZipArchive::new(cursor)?;
  zip.extract(path)?;

  Ok(())
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
