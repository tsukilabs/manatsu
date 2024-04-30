mod command;
mod macros;
mod package;
mod prelude;
mod utils;

use clap::Parser;
use command::{composable, Build, Command, Release};
use inquire::validator::Validation;
use inquire::{required, Text};
use prelude::*;

#[derive(Debug, Parser)]
#[command(name = "manatsu-dev")]
#[command(version, about, long_about = None)]
enum Cli {
  /// Build all the public packages.
  Build(Build),
  /// Generate a composable template.
  Composable,
  /// Update plugin commands.
  Plugin,
  /// Synchronize all README files of the monorepo.
  Readme,
  /// Release a new version, publishing all the public packages.
  Release(Release),
}

#[tokio::main]
async fn main() -> Result<()> {
  let cli = Cli::parse();

  match cli {
    Cli::Build(cmd) => cmd.execute().await,
    Cli::Composable => {
      let validator = |name: &str| {
        if composable::is_valid(name) {
          Ok(Validation::Valid)
        } else {
          Ok(Validation::Invalid("invalid composable name".into()))
        }
      };

      let name = Text::new("composable name: ")
        .with_validator(required!("composable name is required"))
        .with_validator(validator)
        .prompt()?;

      composable::create(name).await
    }
    Cli::Plugin => command::plugin().await,
    Cli::Readme => command::readme(),
    Cli::Release(cmd) => cmd.execute().await,
  }
}
