mod build;
mod json;
pub mod package;
mod release;
pub mod scaffold;

use anyhow::{Context, Result};
pub use build::build;
use miho::{self, MihoCommand};
pub use release::release;
use std::{env, fs};
use std::process::Stdio;

pub(crate) const CLI_MANIFEST: &str = "--manifest-path=cli/Cargo.toml";
pub(crate) const PLUGIN_MANIFEST: &str = "--manifest-path=plugin/Cargo.toml";

/// Synchronizes all README files of the monorepo.
pub fn readme() -> Result<()> {
  let filename = "README.md";
  let cwd = env::current_dir()?;
  let src_readme = cwd.join(filename);

  println!("Copying README files...");
  for pkg in package::all() {
    let dest_readme = package::dir(pkg)?.join(filename);
    fs::copy(&src_readme, &dest_readme)?;
    println!("Copied: {}", dest_readme.display());
  }

  let crates = ["cli", "plugin"];
  for cr in crates {
    let cr_readme = cwd.join(cr).join(filename);
    fs::copy(&src_readme, &cr_readme)?;
    println!("Copied: {}", cr_readme.display());
  }

  println!("Done!");
  Ok(())
}

/// Format files using Prettier.
pub fn format_files<G>(glob: G) -> Result<()>
where
  G: AsRef<str>,
{
  let glob = glob.as_ref();

  println!("Formatting files...");
  miho::Command::new("pnpm")
    .args(["exec", "prettier", glob, "--write"])
    .stderr(Stdio::inherit())
    .stdout(Stdio::inherit())
    .output()
    .with_context(|| format!("Could not format files: {}", glob))?;

  Ok(())
}

/// Lint files, fixing as many issues as possible.
pub fn lint<G>(glob: G, extra_args: Option<Vec<&str>>) -> Result<()>
where
  G: AsRef<str>,
{
  let glob = glob.as_ref();
  let mut cmd = miho::Command::new("pnpm");
  cmd.args(["exec", "eslint", "--fix"]);

  if let Some(args) = extra_args {
    cmd.args(args);
  }

  println!("Linting files...");
  cmd
    .arg(glob)
    .stderr(Stdio::inherit())
    .stdout(Stdio::inherit())
    .output()
    .with_context(|| format!("Could not lint files: {}", glob))?;

  Ok(())
}
