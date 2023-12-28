use super::{json, readme};
use anyhow::Result;
use std::env;
use std::process::{Command, Stdio};

/// Release a new version.
pub fn release() -> Result<()> {
  readme()?;
  let config = json::read_config().ok();

  match config {
    Some(cfg) if cfg.github => github(&cfg.github_token)?,
    _ => local()?,
  }

  let manifest_path = "--manifest-path=cli/Cargo.toml";
  Command::new("cargo")
    .args(["publish", manifest_path])
    .stdout(Stdio::inherit())
    .stderr(Stdio::inherit())
    .output()?;

  Ok(())
}

fn github(github_token: &str) -> Result<()> {
  let package = json::read_package()?;

  let base_url = "https://api.github.com";
  let owner_repo = "manatsujs/manatsu";
  let body = ureq::json!({
    "tag_name": format!("v{}", package.version),
    "name": format!("v{}", package.version),
    "draft": false,
    "prerelease": true,
    "generate_release_notes": true
  });

  let endpoint = format!("{base_url}/repos/{owner_repo}/releases");
  let github_token = format!("Bearer {}", github_token);

  ureq::post(&endpoint)
    .set("Authorization", &github_token)
    .set("X-GitHub-Api-Version", "2022-11-28")
    .set("accept", "application/vnd.github+json")
    .send_json(body)?;

  Ok(())
}

fn local() -> Result<()> {
  let mut command = match env::consts::OS {
    "windows" => Command::new("cmd"),
    _ => Command::new("pnpm"),
  };

  if env::consts::OS == "windows" {
    command.arg("/C").arg("pnpm");
  };

  command
    .args(["publish", "-r", "--no-git-checks"])
    .stdout(Stdio::inherit())
    .stderr(Stdio::inherit())
    .output()?;

  Ok(())
}
