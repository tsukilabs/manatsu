use anyhow::Result;
use serde::Deserialize;
use std::path::PathBuf;
use std::{env, fs};

#[derive(Deserialize)]
#[serde(rename_all(serialize = "snake_case", deserialize = "camelCase"))]
pub struct Package {
  pub version: String,
}

impl<'a> Package {
  /// Private package names.
  pub const PRIVATE: [&'a str; 1] = ["playground"];

  /// Public package names.
  pub const PUBLIC: [&'a str; 7] = [
    "manatsu",
    "components",
    "composables",
    "sass",
    "shared",
    "tauri-plugin",
    "vue-plugin",
  ];

  pub const MANUAL_CHUNK: [&'a str; 3] = ["components", "composables", "vue-plugin"];

  /// Read the root `package.json` file.
  pub fn read_root() -> Result<Package> {
    let path: PathBuf = env::current_dir()?.join("package.json");
    let package = fs::read_to_string(path)?;
    serde_json::from_str::<Package>(&package).map_err(Into::into)
  }

  pub fn is_manual_chunk<P: AsRef<str>>(package: P) -> bool {
    let package = package.as_ref();
    Package::MANUAL_CHUNK.contains(&package)
  }

  pub fn is_private<P: AsRef<str>>(package: P) -> bool {
    let package = package.as_ref();
    Package::PRIVATE.contains(&package)
  }
}

/// Returns all package names.
pub fn all() -> Vec<String> {
  let mut packages = Package::PUBLIC.to_vec();
  packages.extend_from_slice(&Package::PRIVATE);

  packages.into_iter().map(ToString::to_string).collect()
}

/// Returns the path to a package.
pub fn dir<P: AsRef<str>>(package: P) -> Result<PathBuf> {
  let package = package.as_ref();
  let cwd = env::current_dir()?;
  let path = cwd.join("packages").join(package);
  Ok(path)
}

/// Returns the path to the source dir of a given package.
pub fn src<P: AsRef<str>>(package: P) -> Result<PathBuf> {
  let package = package.as_ref();
  let path = dir(package)?.join("src");
  Ok(path)
}

/// Returns the path to the dist dir of a given package.
pub fn dist<P: AsRef<str>>(package: P) -> Result<PathBuf> {
  let package = package.as_ref();
  let path = dir(package)?.join("dist");
  Ok(path)
}

/// Returns the path to the `index.d.ts` file of a given package.
pub fn dts<P: AsRef<str>>(package: P) -> Result<PathBuf> {
  let package = package.as_ref();
  let path = dist(package)?.join("index.d.ts");
  Ok(path)
}
