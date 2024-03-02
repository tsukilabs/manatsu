use crate::package::Package;
use crate::util::Config;
use anyhow::{bail, Result};
use manatsu::{cargo, pnpm};
use miho::git::{Commit, Git, Status};
use reqwest::{header, Client};
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
  let package = Package::read_root()?;
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

  let response = client
    .post(&endpoint)
    .header(header::AUTHORIZATION, &github_token)
    .header(header::ACCEPT, "application/vnd.github+json")
    .header(header::USER_AGENT, "tsukilabs/manatsu")
    .header("X-GitHub-Api-Version", "2022-11-28")
    .json(&body)
    .send()
    .await?;

  if !response.status().is_success() {
    let message = response.text().await?;
    bail!("failed to create a GitHub release:\n{message}");
  }

  Ok(())
}
