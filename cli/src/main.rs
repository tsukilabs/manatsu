use anyhow::Result;
use clap::{Parser, Subcommand};
use manatsu::dev;

#[derive(Debug, Parser)]
#[command(version, about, long_about = None)]
struct ManatsuCli {
  #[command(subcommand)]
  command: Commands,
}

#[derive(Debug, Subcommand)]
enum Commands {
  #[command(subcommand)]
  Dev(DevCommand),
}

#[derive(Debug, Subcommand)]
enum DevCommand {
  Build,
  /// Generate component template.
  Component {
    /// Component name.
    name: String,
  },
  /// Synchronize all README files.
  Readme,
  /// Release a new version.
  Release,
}

impl DevCommand {
  fn execute(&self) -> Result<()> {
    match self {
      DevCommand::Build => dev::build(),
      DevCommand::Component { name } => dev::component(&name),
      DevCommand::Readme => dev::readme(),
      DevCommand::Release => dev::release(),
    }
  }
}

fn main() -> Result<()> {
  let cli = ManatsuCli::parse();

  match cli.command {
    Commands::Dev(value) => value.execute(),
  }
}
