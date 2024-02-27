use crate::package::Package;
use crate::util::Config;
use anyhow::Result;
use manatsu::{cargo, pnpm};
use miho::git::{Commit, Git, Status};
use reqwest::Client;
use std::process::Stdio;

/// Releases a new version, publishing all the public packages.
///
/// It is not necessary to synchronize the README files before
/// calling this function, as it will already do that.
pub async fn release() -> Result<()> {
  super::readme()?;

  if let Ok(true) = Status::is_dirty().await {
    Commit::new("chore: sync readme files")
      .no_verify()
      .stderr(Stdio::null())
      .stdout(Stdio::null())
      .spawn()
      .await?;
  }

  match Config::read().ok() {
    Some(cfg) if cfg.github => {
      create_github_release(&cfg.github_token).await?;
    }
    _ => {
      pnpm!(["publish", "-r", "--no-git-checks"])
        .spawn()?
        .wait()
        .await?;

      let crates = ["manatsu", "tauri-plugin-manatsu"];
      for crate_name in crates {
        cargo!(["publish", "-p", crate_name])
          .spawn()?
          .wait()
          .await?;
      }
    }
  }

  Ok(())
}

async fn create_github_release(github_token: &str) -> Result<()> {
  let package = Package::read()?;
  let client = Client::builder().build()?;

  let base_url = "https://api.github.com";
  let owner_repo = "tsukilabs/manatsu";
  let endpoint = format!("{base_url}/repos/{owner_repo}/releases");
  let github_token = format!("Bearer {github_token}");

  let body = serde_json::json!({
    "tag_name": format!("v{}", package.version),
    "name": format!("v{}", package.version),
    "draft": false,
    "prerelease": true,
    "generate_release_notes": true
  });

  client
    .post(&endpoint)
    .header("Authorization", &github_token)
    .header("X-GitHub-Api-Version", "2022-11-28")
    .header("accept", "application/vnd.github+json")
    .json(&body)
    .send()
    .await?;

  Ok(())
}
