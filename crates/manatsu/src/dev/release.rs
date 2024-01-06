use super::json;
use anyhow::Result;
use miho::git::{self, Commit};
use miho::{cargo, pnpm};
use std::process::Stdio;

/// Releases a new version, publishing all the public packages.
///
/// It is not necessary to synchronize the README files before
/// calling this function, as it will already do that.
pub fn release() -> Result<()> {
  super::readme()?;

  if let Ok(true) = git::is_dirty() {
    Commit::new("chore: sync readme files")
      .no_verify()
      .stderr(Stdio::null())
      .stdout(Stdio::null())
      .output()?;
  }

  match json::read_config().ok() {
    Some(cfg) if cfg.github => create_github_release(&cfg.github_token)?,
    _ => {
      pnpm!(["publish", "-r", "--no-git-checks"])?;

      let crates = ["manatsu", "tauri-plugin-manatsu"];
      for crate_name in crates {
        cargo!(["publish", "-p", crate_name])?;
      }
    }
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
