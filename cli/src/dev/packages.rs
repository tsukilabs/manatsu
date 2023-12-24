use anyhow::Result;
use std::env;
use std::path::PathBuf;

/// Manatsu package names.
pub const PACKAGES: [&str; 3] = ["manatsu", "components", "composables"];

/// Returns the path to a package.
pub fn root(pkg: &str) -> Result<PathBuf> {
  let cwd = env::current_dir()?;
  let path = cwd.join("packages").join(pkg);
  Ok(path)
}

/// Returns the path to the dist folder of a given package.
pub fn dist(pkg: &str) -> Result<PathBuf> {
  let path = root(pkg)?.join("dist");
  Ok(path)
}

pub fn dts(pkg: &str) -> Result<PathBuf> {
  let path = dist(pkg)?.join("index.d.ts");
  Ok(path)
}
