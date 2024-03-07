use anyhow::{bail, Result};
use convert_case::{Case, Casing};
use manatsu::theme;
use std::path::PathBuf;
use std::{env, fs};

#[derive(Debug, clap::Args)]
pub struct Theme {
  /// Theme name.
  name: String,

  /// Source file to parse.
  #[arg(short = 's', long)]
  source: Option<PathBuf>,

  /// Output file name. Defaults to the theme name.
  #[arg(short = 'o', long)]
  output: Option<PathBuf>,

  /// Overwrites the file if it already exists.
  #[arg(short = 'f', long)]
  force: bool,
}

impl super::Command for Theme {
  async fn execute(self) -> Result<()> {
    let source = resolve_path(self.source, || "tokens.css".to_string())?;
    let output = resolve_path(self.output, || self.name.to_case(Case::Kebab))?;

    if output.try_exists()? {
      if self.force {
        fs::remove_file(&output)?;
      } else {
        bail!("file already exists: {}", output.display());
      }
    }

    theme::create(source, output)?;

    Ok(())
  }
}

fn resolve_path(path: Option<PathBuf>, default_name: impl FnOnce() -> String) -> Result<PathBuf> {
  let mut path = path.unwrap_or_else(|| PathBuf::from(default_name()));

  if path.is_relative() {
    let current_dir = env::current_dir()?;
    path = current_dir.join(path);
  }

  Ok(path)
}
