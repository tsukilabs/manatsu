use crate::prelude::*;

#[derive(Deserialize)]
#[serde(rename_all(serialize = "snake_case", deserialize = "camelCase"))]
pub struct Package {
  pub version: String,
}

impl<'a> Package {
  pub const PRIVATE: [&'a str; 1] = ["playground"];

  pub const PUBLIC: [&'a str; 7] = [
    "manatsu",
    "components",
    "composables",
    "shared",
    "style",
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

  pub fn is_manual_chunk(package: impl AsRef<str>) -> bool {
    let package = package.as_ref();
    Package::MANUAL_CHUNK.contains(&package)
  }

  pub fn is_private(package: impl AsRef<str>) -> bool {
    let package = package.as_ref();
    Package::PRIVATE.contains(&package)
  }
}

/// Returns all package names.
pub fn all() -> Vec<String> {
  let mut packages = Package::PUBLIC.to_vec();
  packages.extend_from_slice(&Package::PRIVATE);

  packages.into_iter().map_into().collect_vec()
}

/// Returns the path to a package.
pub fn dir(package: impl AsRef<str>) -> Result<PathBuf> {
  let package = package.as_ref();
  let cwd = env::current_dir()?;
  let path = cwd.join("packages").join(package);
  Ok(path)
}

/// Returns the path to the source dir of a given package.
pub fn src(package: impl AsRef<str>) -> Result<PathBuf> {
  let package = package.as_ref();
  let path = dir(package)?.join("src");
  Ok(path)
}

/// Returns the path to the dist dir of a given package.
pub fn dist(package: impl AsRef<str>) -> Result<PathBuf> {
  let package = package.as_ref();
  let path = dir(package)?.join("dist");
  Ok(path)
}

/// Returns the path to the `index.d.ts` file of a given package.
pub fn dts(package: impl AsRef<str>) -> Result<PathBuf> {
  let package = package.as_ref();
  let path = dist(package)?.join("index.d.ts");
  Ok(path)
}

/// Returns the path to the `index.ts` file of a given package.
pub fn index(package: impl AsRef<str>) -> Result<PathBuf> {
  let package = package.as_ref();
  let path = src(package)?.join("index.ts");
  Ok(path)
}
