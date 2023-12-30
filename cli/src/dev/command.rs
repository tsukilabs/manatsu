use anyhow::{Context, Result};
use miho;

pub fn format_files<T: AsRef<str>>(glob: T) -> Result<()> {
  let glob = glob.as_ref();
  miho::Command::new("pnpm")
    .args(["exec", "prettier", glob, "--write"])
    .stdio(miho::Stdio::Inherit)
    .output()
    .with_context(|| format!("Could not format files: {}", glob))?;

  Ok(())
}

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

  cmd
    .arg(glob)
    .stdio(miho::Stdio::Inherit)
    .output()
    .with_context(|| format!("Could not lint files: {}", glob))?;

  Ok(())
}
