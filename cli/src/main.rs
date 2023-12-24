use clap::{Parser, Subcommand};
use manatsu;
use std::error::Error;

#[derive(Debug, Parser)]
#[command(version, about, long_about = None)]
struct ManatsuCli {
  #[command(subcommand)]
  command: Commands,
}

#[derive(Debug, Subcommand)]
enum Commands {
  #[command(subcommand)]
  Dev(DevCommands),
}

#[derive(Debug, Subcommand)]
enum DevCommands {
  /// Generate component template.
  Component {
    /// Component name.
    name: String,
  },
  /// Synchronize all README files.
  Readme,
}

fn main() -> Result<(), Box<dyn Error>> {
  let cli = ManatsuCli::parse();

  match cli.command {
    Commands::Dev(value) => match value {
      DevCommands::Component { name } => manatsu::component(&name)?,
      DevCommands::Readme => manatsu::readme()?,
    },
  };

  Ok(())
}
