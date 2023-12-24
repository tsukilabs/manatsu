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
  Dev(DevCommands),
}

#[derive(Debug, Subcommand)]
enum DevCommands {
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

fn main() -> Result<()> {
  let cli = ManatsuCli::parse();

  match cli.command {
    Commands::Dev(value) => match value {
      DevCommands::Build => dev::build()?,
      DevCommands::Component { name } => dev::component(&name)?,
      DevCommands::Readme => dev::readme()?,
      DevCommands::Release => dev::release()?,
    },
  };

  Ok(())
}
