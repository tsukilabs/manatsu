use clap::{Parser, Subcommand};
use manatsu::dev;
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
  /// Synchronize all README files.
  Readme,
}

fn main() -> Result<(), Box<dyn Error>> {
  let cli = ManatsuCli::parse();

  match cli.command {
    Commands::Dev(value) => match value {
      DevCommands::Readme => dev::readme()?,
    },
  };

  Ok(())
}
