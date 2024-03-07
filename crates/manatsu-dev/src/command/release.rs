use crate::prelude::*;
use crate::util::Config;
use miho::git::{self, Commit, Git};
use reqwest::{header, Client};
use std::process::Stdio;

#[derive(Debug, clap::Args)]
pub struct Release {
  #[arg(long)]
  only_crate: bool,

  #[arg(long)]
  only_package: bool,
}

impl super::Command for Release {
  /// Release a new version, publishing all the public packages.
  async fn execute(self) -> Result<()> {
    if let Ok(true) = git::is_dirty().await {
      bail!("{}", "working directory is dirty".red());
    }

    super::readme()?;
    commit_if_dirty("chore: sync readme files").await?;

    super::tailwind()?;
    commit_if_dirty("chore: update tailwind classes").await?;

    pnpm!("run", "format").spawn()?.wait().await?;
    commit_if_dirty("style: format files").await?;

    match Config::read().ok() {
      Some(cfg) if cfg.github => {
        create_github_release(&cfg.github_token).await?;
      }
      _ => {
        if !self.only_crate {
          pnpm!(["publish", "-r", "--no-git-checks"])
            .spawn()?
            .wait()
            .await?;
        }

        if !self.only_package {
          let crates = ["manatsu", "tauri-plugin-manatsu"];
          for crate_name in crates {
            cargo!(["publish", "-p", crate_name])
              .spawn()?
              .wait()
              .await?;
          }
        }
      }
    }

    Ok(())
  }
}

async fn create_github_release(github_token: &str) -> Result<()> {
  let package = Package::read_root()?;
  let client = Client::builder().build()?;

  let owner_repo = "tsukilabs/manatsu";
  let endpoint = format!("https://api.github.com/repos/{owner_repo}/releases");
  let auth = format!("Bearer {github_token}");

  let body = serde_json::json!({
    "tag_name": format!("v{}", package.version),
    "name": format!("v{}", package.version),
    "draft": false,
    "prerelease": true,
    "generate_release_notes": true
  });

  let response = client
    .post(&endpoint)
    .header(header::ACCEPT, "application/vnd.github+json")
    .header(header::AUTHORIZATION, &auth)
    .header(header::USER_AGENT, owner_repo)
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

async fn commit_if_dirty(message: &str) -> Result<()> {
  if let Ok(true) = git::is_dirty().await {
    Commit::new(message)
      .no_verify()
      .stderr(Stdio::null())
      .stdout(Stdio::null())
      .spawn()
      .await?;
  }

  Ok(())
}
