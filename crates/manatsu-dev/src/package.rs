use crate::prelude::*;

#[derive(Deserialize)]
#[serde(rename_all(serialize = "snake_case", deserialize = "camelCase"))]
pub struct Package {
  pub version: String,
}

impl<'a> Package {
  pub const PUBLIC: [&'a str; 5] = [
    "manatsu",
    "composables",
    "shared",
    "tauri-plugin",
    "vue-plugin",
  ];

  pub const MANUAL_CHUNK: [&'a str; 3] = ["composables", "tauri-plugin", "vue-plugin"];

  pub fn read_root() -> Result<Package> {
    let path: PathBuf = env::current_dir()?.join("package.json");
    let package = fs::read_to_string(path)?;
    serde_json::from_str::<Package>(&package).map_err(Into::into)
  }

  pub fn is_manual_chunk(package: impl AsRef<str>) -> bool {
    let package = package.as_ref();
    Package::MANUAL_CHUNK.contains(&package)
  }
}

pub fn all() -> Vec<String> {
  Package::PUBLIC
    .into_iter()
    .map_into()
    .collect_vec()
}

pub fn dir(package: impl AsRef<str>) -> Result<PathBuf> {
  let package = package.as_ref();
  let cwd = env::current_dir()?;
  let path = cwd.join("packages").join(package);
  Ok(path)
}

pub fn src(package: impl AsRef<str>) -> Result<PathBuf> {
  let package = package.as_ref();
  let path = dir(package)?.join("src");
  Ok(path)
}

pub fn dist(package: impl AsRef<str>) -> Result<PathBuf> {
  let package = package.as_ref();
  let path = dir(package)?.join("dist");
  Ok(path)
}

pub fn dts(package: impl AsRef<str>) -> Result<PathBuf> {
  let package = package.as_ref();
  let path = dist(package)?.join("index.d.ts");
  Ok(path)
}

pub fn index(package: impl AsRef<str>) -> Result<PathBuf> {
  let package = package.as_ref();
  let path = src(package)?.join("index.ts");
  Ok(path)
}
