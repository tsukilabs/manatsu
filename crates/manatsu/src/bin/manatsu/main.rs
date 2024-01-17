mod command;

use anyhow::Result;
use clap::Parser;
use command::CliCommand;

#[derive(Debug, Parser)]
#[command(name = "manatsu")]
#[command(version, about, long_about = None)]
enum Cli {
  /// Easily create a new project.
  Create(command::Create),

  /// Helpful commands when contributing to Manatsu.
  #[command(subcommand)]
  Dev(command::Dev),
}

fn main() -> Result<()> {
  let cli = Cli::parse();

  match cli {
    Cli::Create(cmd) => cmd.execute(),
    Cli::Dev(cmd) => cmd.execute(),
  }
}
