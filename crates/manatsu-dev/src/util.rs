use anyhow::{Context, Result};
use manatsu::pnpm;

/// Format files using Prettier.
pub fn format_files<G: AsRef<str>>(glob: G) -> Result<()> {
  let glob = glob.as_ref();

  println!("Formatting files...");
  pnpm!(["exec", "prettier", glob, "--write"])
    .with_context(|| format!("Could not format files: {}", glob))?;

  Ok(())
}

/// Lint files, fixing as many issues as possible.
pub fn lint<G: AsRef<str>>(glob: G, extra_args: Option<Vec<&str>>) -> Result<()> {
  let mut args = vec!["exec", "eslint", "--fix"];
  if let Some(extra) = extra_args {
    for arg in extra {
      args.push(arg);
    }
  }

  let glob = glob.as_ref();
  args.push(glob);

  println!("Linting files...");
  pnpm!(args).with_context(|| format!("Could not lint files: {}", glob))?;

  Ok(())
}
