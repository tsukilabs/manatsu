mod command;
mod config;
mod package;
mod util;

use anyhow::Result;
use clap::Parser;
use command::{component, composable};
use inquire::validator::Validation;
use inquire::{required, Text};

#[derive(Debug, Parser)]
#[command(name = "manatsu-dev")]
#[command(version, about, long_about = None)]
enum Cli {
  /// Builds all the public packages.
  Build {
    /// If present, only the indicated packages will be built.
    packages: Option<Vec<String>>,
  },
  /// Generates a component template.
  Component,
  /// Generates a composable template.
  Composable,
  /// Synchronizes all README files of the monorepo.
  Readme,
  /// Releases a new version, publishing all the public packages.
  Release,
}

#[tokio::main]
async fn main() -> Result<()> {
  let cli = Cli::parse();

  match cli {
    Cli::Build { packages } => {
      let packages = packages.as_deref();
      match packages {
        Some(p) if !p.is_empty() => command::build(p),
        _ => command::build(package::PUBLIC_PACKAGES),
      }
    }
    Cli::Component => {
      let validator = |name: &str| {
        if component::is_valid(name)? {
          Ok(Validation::Valid)
        } else {
          Ok(Validation::Invalid("Invalid component name".into()))
        }
      };

      let name = Text::new("Component name")
        .with_validator(required!("Component name is required"))
        .with_validator(validator)
        .prompt()?;

      component::create(name)
    }
    Cli::Composable => {
      let validator = |name: &str| {
        if composable::is_valid(name)? {
          Ok(Validation::Valid)
        } else {
          Ok(Validation::Invalid("Invalid composable name".into()))
        }
      };

      let name = Text::new("Composable name")
        .with_validator(required!("Composable name is required"))
        .with_validator(validator)
        .prompt()?;

      composable::create(name)
    }
    Cli::Readme => command::readme(),
    Cli::Release => command::release().await,
  }
}
