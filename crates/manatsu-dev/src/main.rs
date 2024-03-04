mod command;
mod package;
mod util;

use anyhow::Result;
use clap::Parser;
use command::{component, composable, Build, Command, Release};
use inquire::validator::Validation;
use inquire::{required, Text};

#[derive(Debug, Parser)]
#[command(name = "manatsu-dev")]
#[command(version, about, long_about = None)]
enum Cli {
  /// Build all the public packages.
  Build(Build),
  /// Generate a component template.
  Component,
  /// Generate a composable template.
  Composable,
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
    Cli::Component => {
      let validator = |name: &str| {
        if component::is_valid(name) {
          Ok(Validation::Valid)
        } else {
          Ok(Validation::Invalid("invalid component name".into()))
        }
      };

      let name = Text::new("Component name")
        .with_validator(required!("component name is required"))
        .with_validator(validator)
        .prompt()?;

      component::create(name).await
    }
    Cli::Composable => {
      let validator = |name: &str| {
        if composable::is_valid(name) {
          Ok(Validation::Valid)
        } else {
          Ok(Validation::Invalid("invalid composable name".into()))
        }
      };

      let name = Text::new("Composable name")
        .with_validator(required!("composable name is required"))
        .with_validator(validator)
        .prompt()?;

      composable::create(name).await
    }
    Cli::Readme => command::readme(),
    Cli::Release(cmd) => cmd.execute().await,
  }
}
