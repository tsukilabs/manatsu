use super::CliCommand;
use anyhow::{bail, Result};
use clap::Args;
use convert_case::{Case, Casing};
use manatsu::theme;
use std::{env, fs};

#[derive(Debug, Args)]
pub struct Theme {
  /// Theme name.
  name: String,

  /// Source file to parse.
  #[arg(short = 's', long, default_value = "tokens.css")]
  source: String,

  /// Output file name. Defaults to the theme name.
  #[arg(short = 'o', long)]
  output: Option<String>,

  /// Overwrites the file if it already exists.
  #[arg(short = 'f', long)]
  force: bool,
}

impl CliCommand for Theme {
  async fn execute(self) -> Result<()> {
    let output = if let Some(output) = &self.output {
      output.to_case(Case::Kebab)
    } else {
      format!("{}.css", self.name.to_case(Case::Kebab))
    };

    let output = env::current_dir()?.join(output);
    if output.try_exists()? {
      if self.force {
        fs::remove_file(&output)?
      } else {
        bail!("File already exists: {}", output.display());
      }
    }

    theme::create(&self.source, output)?;
    Ok(())
  }
}
