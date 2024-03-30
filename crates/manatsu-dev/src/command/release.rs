use crate::bail_on_output_error;
use crate::package::Package;
use crate::prelude::*;
use crate::utils::Config;
use clap::Args;
use reqwest::{header, Client};

#[derive(Debug, Args)]
pub struct Release {
  #[arg(long)]
  only_crate: bool,

  #[arg(long)]
  only_package: bool,
}

impl super::Command for Release {
  /// Release a new version, publishing all the public packages.
  async fn execute(self) -> Result<()> {
    prepare().await?;

    let config = Config::read().ok();
    if matches!(config, Some(ref c) if c.github) {
      create_github_release(config.unwrap().github_token).await?;
    } else {
      if !self.only_crate {
        let status = pnpm!(["publish", "-r", "--no-git-checks"])
          .spawn()?
          .wait()
          .await?;

        if !status.success() {
          bail!("{}", "failed to publish packages".red());
        }
      }

      if !self.only_package {
        let crates = ["manatsu", "tauri-plugin-manatsu"];
        for crate_name in crates {
          let status = cargo!(["publish", "-p", crate_name])
            .spawn()?
            .wait()
            .await?;

          if !status.success() {
            bail!("{}", "failed to publish crates".red());
          }
        }
      }
    }

    Ok(())
  }
}

async fn prepare() -> Result<()> {
  if let Ok(true) = is_dirty().await {
    bail!("{}", "working directory is dirty".red());
  }

  super::readme()?;
  commit_if_dirty("chore: sync readme files").await?;

  super::plugin().await?;
  commit_if_dirty("chore: update plugin commands").await?;

  super::tailwind()?;
  commit_if_dirty("chore: update tailwind classes").await?;

  let status = pnpm!("run", "format").spawn()?.wait().await?;
  if !status.success() {
    bail!("{}", "failed to format files".red());
  }

  commit_if_dirty("style: format files").await?;

  Ok(())
}

async fn create_github_release<T>(github_token: T) -> Result<()>
where
  T: AsRef<str>,
{
  let package = Package::read_root()?;
  let client = Client::builder().build()?;

  let owner_repo = "tsukilabs/manatsu";
  let endpoint = format!("https://api.github.com/repos/{owner_repo}/releases");
  let auth = format!("Bearer {}", github_token.as_ref());

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
  if let Ok(true) = is_dirty().await {
    Command::new("git")
      .args(["commit", "-m", message, "--no-verify", "--all"])
      .stderr(Stdio::null())
      .stdout(Stdio::null())
      .spawn()?
      .wait()
      .await?;
  }

  Ok(())
}

async fn is_dirty() -> Result<bool> {
  let diff = Command::new("git").arg("diff").output().await?;
  bail_on_output_error!(diff);

  if !diff.stdout.is_empty() {
    return Ok(true);
  }

  let output = Command::new("git")
    .args(["status", "--porcelain"])
    .output()
    .await?;

  bail_on_output_error!(output);

  let is_empty = output.stdout.is_empty();

  Ok(!is_empty)
}
