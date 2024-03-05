mod template;

use anyhow::{anyhow, bail, Context, Result};
use convert_case::{Case, Casing};
use globset::{Glob, GlobSet, GlobSetBuilder};
use regex::Regex;
use std::io::Cursor;
use std::path::{Path, PathBuf};
use std::time::Instant;
use std::{env, fs};
pub use template::Template;
use walkdir::WalkDir;
use zip::ZipArchive;

const DEFAULT_VERSION: &str = "0.1.0";

macro_rules! clone_or_empty_string {
  ($value:expr) => {
    if let Some(ref value) = $value {
      value.clone()
    } else {
      String::default()
    }
  };
}

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
  /// Tauri: <https://github.com/tsukilabs/manatsu-template-tauri>
  ///
  /// Vue: <https://github.com/tsukilabs/manatsu-template-vue>
  pub async fn create(self) -> Result<()> {
    let start = Instant::now();

    if !Self::is_valid(&self.name) {
      bail!("invalid project name: {}", self.name);
    }

    let path = env::current_dir()?.join(&self.name);

    if path.try_exists()? {
      if self.force {
        fs::remove_dir_all(&path)?;
      } else {
        bail!("directory already exists: {}", path.display());
      }
    }

    println!("downloading template...");
    let bytes = self.template.download().await?;

    println!("building project...");
    fs::create_dir_all(&path).with_context(|| "could not create project dir")?;

    let cursor = Cursor::new(bytes);
    let mut zip = ZipArchive::new(cursor)?;
    zip.extract(&path)?;

    self.hoist_extracted_files(&path)?;
    self.update_project_metadata(&path)?;

    println!("built {} in {:?}", self.name, start.elapsed());

    Ok(())
  }

  fn hoist_extracted_files(&self, path: &Path) -> Result<()> {
    let globset = build_globset();
    let dir = self.find_extracted_dir(path)?;

    for entry in fs::read_dir(&dir)?.flatten() {
      let entry_path = entry.path();

      if globset.is_match(&entry_path) {
        remove_entry(entry_path)?;
      } else {
        let target_path = path.join(entry.file_name());
        fs::rename(entry_path, target_path)?;
      }
    }

    fs::remove_dir_all(dir)?;

    Ok(())
  }

  fn find_extracted_dir(&self, path: &Path) -> Result<PathBuf> {
    let template_name: &str = self.template.into();
    for entry in fs::read_dir(path)? {
      let entry = entry?;
      let entry_path = entry.path();

      if entry.metadata()?.is_dir() {
        let file_name = entry.file_name();
        if matches!(file_name.to_str(), Some(n) if n.contains(template_name)) {
          return Ok(entry_path);
        }
      }

      remove_entry(&entry_path)?;
    }

    Err(anyhow!("could not find extracted folder"))
  }

  fn update_project_metadata(&self, path: &Path) -> Result<()> {
    self.update_package_json(path)?;

    if matches!(self.template, Template::Tauri) {
      self.update_cargo_toml(path)?;
      self.update_tauri_conf(path)?;
    }

    self.update_index_html(path)?;

    Ok(())
  }

  fn update_package_json<P: AsRef<Path>>(&self, dir_path: P) -> Result<()> {
    let path = dir_path.as_ref().join("package.json");
    let package_json = fs::read_to_string(&path)?;
    let mut package_json: serde_json::Value = serde_json::from_str(&package_json)?;

    macro_rules! update {
      ($key:literal, $value:expr) => {
        package_json[$key] = serde_json::Value::String($value);
      };
    }

    update!("name", self.name.clone());
    update!("version", DEFAULT_VERSION.to_string());
    update!("description", clone_or_empty_string!(self.description));

    let json = serde_json::to_string_pretty(&package_json)?;
    fs::write(path, json)?;

    Ok(())
  }

  fn update_cargo_toml<P: AsRef<Path>>(&self, dir_path: P) -> Result<()> {
    let glob = Glob::new("**/Cargo.toml")?.compile_matcher();
    let entries = WalkDir::new(dir_path)
      .into_iter()
      .filter_map(std::result::Result::ok);

    for entry in entries {
      let path = entry.path();

      if glob.is_match(path) {
        let cargo_toml = fs::read_to_string(path)?;
        let mut cargo_toml: toml::Value = toml::from_str(&cargo_toml)?;

        macro_rules! update {
          ($key:literal, $value:expr) => {
            if cargo_toml["package"].get($key).is_some() {
              cargo_toml["package"][$key] = toml::Value::String($value);
            }
          };
        }

        macro_rules! update_workspace {
          ($key:literal, $value:expr) => {
            if cargo_toml["workspace"]["package"].get($key).is_some() {
              cargo_toml["workspace"]["package"][$key] = toml::Value::String($value);
            }
          };
        }

        if cargo_toml.get("package").is_some() {
          update!("name", self.name.clone());
          update!("version", DEFAULT_VERSION.to_string());
          update!("description", clone_or_empty_string!(&self.description));
        }

        if let Some(workspace) = cargo_toml.get("workspace") {
          if workspace.get("package").is_some() {
            update_workspace!("name", self.name.clone());
            update_workspace!("version", DEFAULT_VERSION.to_string());
            update_workspace!("description", clone_or_empty_string!(&self.description));
          }
        }

        let cargo_toml = toml::to_string_pretty(&cargo_toml)?;
        fs::write(path, cargo_toml)?;
      }
    }

    Ok(())
  }

  fn update_tauri_conf<P: AsRef<Path>>(&self, dir_path: P) -> Result<()> {
    let path = dir_path.as_ref().join("src-tauri/tauri.conf.json");
    let tauri_conf = fs::read_to_string(&path)?;
    let mut tauri_conf: serde_json::Value = serde_json::from_str(&tauri_conf)?;

    macro_rules! update {
      ($key:literal, $value:expr) => {
        tauri_conf["package"][$key] = serde_json::Value::String($value);
      };
    }

    update!("productName", self.name.clone());
    update!("version", DEFAULT_VERSION.to_string());

    let title = self.name.to_case(Case::Title);
    tauri_conf["tauri"]["windows"][0]["title"] = serde_json::Value::String(title);

    let tauri_conf = serde_json::to_string_pretty(&tauri_conf)?;
    fs::write(path, tauri_conf)?;

    Ok(())
  }

  fn update_index_html<P: AsRef<Path>>(&self, dir_path: P) -> Result<()> {
    let path = dir_path.as_ref().join("index.html");
    let index_html = fs::read_to_string(&path)?;
    let index_html = index_html.replace("Manatsu", &self.name);

    fs::write(path, index_html)?;

    Ok(())
  }

  /// Determines whether the project name is valid.
  pub fn is_valid<T: AsRef<str>>(name: T) -> bool {
    let regex = Regex::new(Project::NAME_REGEX).expect("hardcoded regex should be valid");
    regex.is_match(name.as_ref())
  }
}

/// Build a globset to match files and directories to remove from the extracted template.
fn build_globset() -> GlobSet {
  let mut builder = GlobSetBuilder::new();

  macro_rules! add {
    ($glob:expr) => {
      builder.add(Glob::new($glob).expect("hardcoded glob should be valid"));
    };
  }

  // Directories
  add!("**/dist");
  add!("**/target");
  add!("**/node_modules");
  add!("**/.github");

  // Files
  add!("**/LICENSE");
  add!("**/pnpm-lock.yaml");
  add!("**/*.lock");
  add!("**/*.log");
  add!("**/config.json");

  builder.build().unwrap()
}

fn remove_entry<P: AsRef<Path>>(path: P) -> Result<()> {
  let path = path.as_ref();
  let metadata = path.metadata()?;

  if metadata.is_dir() {
    fs::remove_dir_all(path)?;
  } else if metadata.is_file() {
    fs::remove_file(path)?;
  }

  Ok(())
}

#[cfg(test)]
mod tests {
  use super::Project;

  #[test]
  fn should_determine_if_name_is_valid() {
    assert!(Project::is_valid("my-project"));
    assert!(!Project::is_valid("真夏"));
  }
}
