mod commands;

use anyhow::Result;
use clap::Parser;
use commands::*;

#[derive(Debug, Parser)]
#[command(name = "manatsu")]
#[command(version, about, long_about = None)]
enum Cli {
  /// Easily create a new project.
  Create(CreateCommand),

  /// Helpful commands when contributing to Manatsu.
  #[command(subcommand)]
  Dev(DevCommand),
}

fn main() -> Result<()> {
  let cli = Cli::parse();

  match cli {
    Cli::Create(cmd) => cmd.execute(),
    Cli::Dev(cmd) => cmd.execute(),
  }
}
