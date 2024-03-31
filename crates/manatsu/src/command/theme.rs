use crate::prelude::*;
use crate::theme;

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
    let source = normalize(self.source, || "tokens.css".into())?;
    let output = normalize(self.output, || self.name.to_case(Case::Kebab))?;

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

fn normalize(path: Option<PathBuf>, default_name: impl FnOnce() -> String) -> Result<PathBuf> {
  let mut path = path.unwrap_or_else(|| PathBuf::from(default_name()));

  if path.is_relative() {
    let current_dir = env::current_dir()?;
    path = current_dir.join(path);
  }

  Ok(path)
}
