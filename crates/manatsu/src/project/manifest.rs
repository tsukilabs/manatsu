use super::Project;
use anyhow::Result;
use convert_case::{Case, Casing};
use globset::Glob;
use std::fs;
use std::path::Path;
use walkdir::WalkDir;

const BASE_VERSION: &str = "0.1.0";

macro_rules! clone_or_empty {
  ($value:expr) => {
    if let Some(value) = $value {
      value.clone()
    } else {
      String::default()
    }
  };
}

pub fn update_package_json<P: AsRef<Path>>(dir_path: P, project: &Project) -> Result<()> {
  let path = dir_path.as_ref().join("package.json");
  let package = fs::read_to_string(&path)?;
  let mut package: serde_json::Value = serde_json::from_str(&package)?;

  macro_rules! update {
    ($key:literal, $value:expr) => {
      package[$key] = serde_json::Value::String($value);
    };
  }

  update!("name", project.name.clone());
  update!("version", BASE_VERSION.to_string());
  update!("description", clone_or_empty!(&project.description));

  let json = serde_json::to_string_pretty(&package)?;
  fs::write(path, json)?;

  Ok(())
}

pub fn update_cargo_toml<P: AsRef<Path>>(dir_path: P, project: &Project) -> Result<()> {
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
        update!("name", project.name.clone());
        update!("version", BASE_VERSION.to_string());
        update!("description", clone_or_empty!(&project.description));
      }

      if let Some(workspace) = cargo_toml.get("workspace") {
        if workspace.get("package").is_some() {
          update_workspace!("name", project.name.clone());
          update_workspace!("version", BASE_VERSION.to_string());
          update_workspace!("description", clone_or_empty!(&project.description));
        }
      }

      let cargo_toml = toml::to_string_pretty(&cargo_toml)?;
      fs::write(path, cargo_toml)?;
    }
  }

  Ok(())
}

pub fn update_tauri_conf<P: AsRef<Path>>(dir_path: P, project: &Project) -> Result<()> {
  let path = dir_path.as_ref().join("src-tauri").join("tauri.conf.json");
  let tauri_conf = fs::read_to_string(&path)?;
  let mut tauri_conf: serde_json::Value = serde_json::from_str(&tauri_conf)?;

  macro_rules! update {
    ($key:literal, $value:expr) => {
      tauri_conf["package"][$key] = serde_json::Value::String($value);
    };
  }

  update!("productName", project.name.clone());
  update!("version", BASE_VERSION.to_string());

  let title = project.name.to_case(Case::Title);
  let title = serde_json::Value::String(title);
  tauri_conf["tauri"]["windows"][0]["title"] = title;

  let tauri_conf = serde_json::to_string_pretty(&tauri_conf)?;
  fs::write(path, tauri_conf)?;

  Ok(())
}
