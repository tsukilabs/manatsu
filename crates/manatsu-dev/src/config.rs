use anyhow::Result;
use serde::Deserialize;
use std::{env, fs};

#[derive(Deserialize)]
pub(crate) struct Config {
  pub github: bool,
  pub github_token: String,
}

impl Config {
  pub fn read() -> Result<Config> {
    let path = env::current_dir()?.join("config.json");
    let content = fs::read_to_string(path)?;
    let config: Config = serde_json::from_str(&content)?;
    Ok(config)
  }
}
