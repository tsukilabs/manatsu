use anyhow::Result;
use std::env;
use std::path::PathBuf;

/// Manatsu package names.
pub const PACKAGES: [&str; 4] = ["manatsu", "components", "composables", "icons"];

/// Returns the path to a package.
pub fn dir<T: AsRef<str>>(pkg: T) -> Result<PathBuf> {
  let pkg = pkg.as_ref();
  let cwd = env::current_dir()?;
  let path = cwd.join("packages").join(pkg);
  Ok(path)
}

/// Returns the path to the source folder of a given package.
pub fn src<T: AsRef<str>>(pkg: T) -> Result<PathBuf> {
  let pkg = pkg.as_ref();
  let path = dir(pkg)?.join("src");
  Ok(path)
}

/// Returns the path to the dist folder of a given package.
pub fn dist<T: AsRef<str>>(pkg: T) -> Result<PathBuf> {
  let pkg = pkg.as_ref();
  let path = dir(pkg)?.join("dist");
  Ok(path)
}

pub fn dts<T: AsRef<str>>(pkg: T) -> Result<PathBuf> {
  let pkg = pkg.as_ref();
  let path = dist(pkg)?.join("index.d.ts");
  Ok(path)
}

pub fn is_standalone<T: AsRef<str>>(pkg: T) -> bool {
  let pkg = pkg.as_ref();
  pkg == "manatsu" || pkg == "icons"
}
