use super::{json, readme};
use anyhow::Result;
use miho::git::{self, GitCommit};
use miho::stdio::MihoStdio;
use std::env;
use std::process::{Command, Stdio};

/// Releases a new version, publishing all the public packages.
///
/// It is not necessary to synchronize the README files before
/// calling this function, as it will already do that.
pub fn release() -> Result<()> {
  readme()?;

  if let Ok(true) = git::is_dirty() {
    let commit_flags = GitCommit {
      message: String::from("chore: sync readme files"),
      no_verify: true,
    };

    git::commit(MihoStdio::Inherit, commit_flags)?;
  }

  match json::read_config().ok() {
    Some(cfg) if cfg.github => create_github_release(&cfg.github_token)?,
    _ => publish_to_npm()?,
  }

  Ok(())
}

fn create_github_release(github_token: &str) -> Result<()> {
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

fn publish_to_npm() -> Result<()> {
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

  publish_to_cargo()?;
  Ok(())
}

fn publish_to_cargo() -> Result<()> {
  let manifest_path = "--manifest-path=cli/Cargo.toml";
  Command::new("cargo")
    .args(["publish", manifest_path])
    .stdout(Stdio::inherit())
    .stderr(Stdio::inherit())
    .output()?;

  Ok(())
}
