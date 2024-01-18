use anyhow::Result;
use serde::Deserialize;
use std::{env, fs};

#[derive(Deserialize)]
pub(crate) struct Config {
  pub github: bool,
  pub github_token: String,
}

#[derive(Deserialize)]
#[serde(rename_all(serialize = "snake_case", deserialize = "camelCase"))]
pub(crate) struct Package {
  pub version: String,
}

fn read(file: &str) -> Result<String> {
  let json = env::current_dir()?.join(file);
  let content = fs::read_to_string(json)?;
  Ok(content)
}

/// Read the `config.json` file.
pub(crate) fn read_config() -> Result<Config> {
  let content = read("config.json")?;
  let config: Config = serde_json::from_str(&content)?;
  Ok(config)
}

/// Read the `package.json` file.
pub(crate) fn read_package() -> Result<Package> {
  let content = read("package.json")?;
  let package: Package = serde_json::from_str(&content)?;
  Ok(package)
}
