use anyhow::Result;
use std::env;
use std::path::PathBuf;

/// Manatsu package names.
pub const PACKAGES: [&str; 4] = ["manatsu", "components", "composables", "icons"];

/// Returns the path to a package.
pub fn package_dir(pkg: &str) -> Result<PathBuf> {
  let cwd = env::current_dir()?;
  let path = cwd.join("packages").join(pkg);
  Ok(path)
}

/// Returns the path to the source folder of a given package.
pub fn package_src(pkg: &str) -> Result<PathBuf> {
  let path = package_dir(pkg)?.join("src");
  Ok(path)
}

/// Returns the path to the dist folder of a given package.
pub fn package_dist(pkg: &str) -> Result<PathBuf> {
  let path = package_dir(pkg)?.join("dist");
  Ok(path)
}

pub(crate) fn dts_file(pkg: &str) -> Result<PathBuf> {
  let path = package_dist(pkg)?.join("index.d.ts");
  Ok(path)
}

pub(crate) fn is_standalone(pkg: &str) -> bool {
  pkg == "manatsu" || pkg == "icons"
}