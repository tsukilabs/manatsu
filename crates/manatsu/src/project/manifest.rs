use super::Project;
use anyhow::Result;
use globset::Glob;
use serde::{Deserialize, Serialize};
use std::fs;
use std::path::Path;
use walkdir::WalkDir;

pub trait Manifest {
  fn update_metadata<P: AsRef<Path>>(dir_path: P, project: &Project) -> Result<()>;
}

#[derive(Deserialize, Serialize)]
#[serde(rename_all(serialize = "snake_case", deserialize = "camelCase"))]
pub(super) struct PackageJson {
  name: String,
  description: String,
  version: String,
}

impl PackageJson {
  fn read<P: AsRef<Path>>(path: P) -> Result<serde_json::Value> {
    let json = fs::read_to_string(path)?;
    let package: serde_json::Value = serde_json::from_str(&json)?;
    Ok(package)
  }
}

impl Manifest for PackageJson {
  fn update_metadata<P: AsRef<Path>>(dir_path: P, project: &Project) -> Result<()> {
    let path = dir_path.as_ref().join("package.json");
    let mut package = Self::read(&path)?;

    macro_rules! update {
      ($key:literal, $value:expr) => {
        package[$key] = serde_json::Value::String($value);
      };
    }

    update!("name", project.name.clone());
    update!("version", "0.1.0".to_string());

    if let Some(description) = &project.description {
      update!("description", description.clone());
    } else {
      update!("description", String::from(""));
    }

    let json = serde_json::to_string_pretty(&package)?;
    fs::write(path, json)?;

    Ok(())
  }
}

#[derive(Deserialize, Serialize)]
pub(super) struct CargoToml {
  package: Option<CargoPackage>,
  workspace: Option<CargoWorkspace>,
}

#[derive(Deserialize, Serialize)]
struct CargoWorkspace {
  package: Option<CargoPackage>,
}

#[derive(Deserialize, Serialize)]
struct CargoPackage {
  name: Option<String>,
  description: Option<String>,
  version: Option<String>,
}

impl Manifest for CargoToml {
  fn update_metadata<P: AsRef<Path>>(dir_path: P, project: &Project) -> Result<()> {
    let glob = Glob::new("**/Cargo.toml")?.compile_matcher();
    for entry in WalkDir::new(dir_path).into_iter().filter_map(|e| e.ok()) {
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

        let description = if let Some(desc) = &project.description {
          desc.clone()
        } else {
          String::from("")
        };

        if cargo_toml.get("package").is_some() {
          update!("name", project.name.clone());
          update!("version", "0.1.0".to_string());
          update!("description", description.clone());
        }

        if let Some(workspace) = cargo_toml.get("workspace") {
          if workspace.get("package").is_some() {
            update_workspace!("name", project.name.clone());
            update_workspace!("version", "0.1.0".to_string());
            update_workspace!("description", description);
          }
        }

        let cargo_toml = toml::to_string_pretty(&cargo_toml)?;
        fs::write(path, cargo_toml)?;
      }
    }

    Ok(())
  }
}
