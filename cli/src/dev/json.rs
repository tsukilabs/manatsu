use anyhow::Result;
use serde::{Deserialize, Serialize};
use std::env;
use std::fs;

#[derive(Deserialize, Serialize)]
pub struct Config {
  pub github: bool,
  pub github_token: String,
}

#[derive(Deserialize, Serialize)]
pub struct Package {
  pub version: String,
}

fn read(file: &str) -> Result<String> {
  let json = env::current_dir()?.join(file);
  let content = fs::read_to_string(json)?;
  Ok(content)
}

/// Read the `config.json` file.
pub fn read_config() -> Result<Config> {
  let content = read("config.json")?;
  let config: Config = serde_json::from_str(&content)?;
  Ok(config)
}

/// Read the `package.json` file.
pub fn read_package() -> Result<Package> {
  let content = read("package.json")?;
  let package: Package = serde_json::from_str(&content)?;
  Ok(package)
}
