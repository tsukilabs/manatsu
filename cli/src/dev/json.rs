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

/// Read the local `config.json` file.
fn read(file: &str) -> Result<String> {
  let json = env::current_dir()?.join(file);
  let content = fs::read_to_string(json)?;
  Ok(content)
}

pub fn read_config() -> Result<String> {
  read("config.json")
}

pub fn read_package() -> Result<String> {
  read("package.json")
}
