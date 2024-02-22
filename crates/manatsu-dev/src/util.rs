use anyhow::Result;
use colored::Colorize;
use manatsu::pnpm;

/// Format files using Prettier.
pub async fn format_files<G: AsRef<str>>(glob: G) -> Result<()> {
  println!("{}", "formatting files...".bright_cyan());

  pnpm!(["exec", "prettier", glob.as_ref(), "--write"])
    .spawn()?
    .wait()
    .await?;

  Ok(())
}

/// Lint files, fixing as many issues as possible.
pub async fn lint<G: AsRef<str>>(glob: G, extra_args: Option<Vec<&str>>) -> Result<()> {
  let mut args = vec!["exec", "eslint", "--fix"];
  if let Some(extra) = extra_args {
    for arg in extra {
      args.push(arg);
    }
  }

  args.push(glob.as_ref());

  println!("{}", "linting files...".bright_cyan());
  pnpm!(args).spawn()?.wait().await?;

  Ok(())
}
