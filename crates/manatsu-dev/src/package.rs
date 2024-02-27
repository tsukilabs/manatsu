use anyhow::Result;
use serde::Deserialize;
use std::path::PathBuf;
use std::{env, fs};

/// Public package names.
pub const PUBLIC_PACKAGES: [&str; 5] = ["manatsu", "components", "composables", "sass", "shared"];

/// Private package names.
pub const PRIVATE_PACKAGES: [&str; 1] = ["playground"];

#[derive(Deserialize)]
#[serde(rename_all(serialize = "snake_case", deserialize = "camelCase"))]
pub struct Package {
  pub version: String,
}

impl Package {
  /// Read the root `package.json` file.
  pub fn read_root() -> Result<Package> {
    let path: PathBuf = env::current_dir()?.join("package.json");
    let package = fs::read_to_string(path)?;
    serde_json::from_str::<Package>(&package).map_err(Into::into)
  }
}

/// Returns all package names.
pub fn all() -> Vec<String> {
  let mut packages = PUBLIC_PACKAGES.to_vec();
  packages.extend_from_slice(&PRIVATE_PACKAGES);

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

/// Whether the package should be merged with the core package.
pub fn is_standalone<P: AsRef<str>>(package: P) -> bool {
  let package = package.as_ref();
  package != "components" && package != "composables"
}
