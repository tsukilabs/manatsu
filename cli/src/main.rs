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
  /// Generate component template.
  Component,
  /// Synchronize all README files.
  Readme,
}

fn main() -> Result<(), Box<dyn Error>> {
  let cli = ManatsuCli::parse();

  match cli.command {
    Commands::Component => todo!(),
    Commands::Readme => manatsu::readme()?,
  };

  Ok(())
}
