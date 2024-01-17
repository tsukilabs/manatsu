use super::ManatsuCommand;
use anyhow::Result;
use clap::Subcommand;
use inquire::validator::Validation;
use inquire::{required, Text};
use manatsu::dev::package;
use manatsu::dev::scaffold::{component, composable};

#[derive(Debug, Subcommand)]
pub enum DevCommand {
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

impl ManatsuCommand for DevCommand {
  fn execute(&self) -> Result<()> {
    match self {
      DevCommand::Build { packages } => {
        let packages = packages.as_deref();
        match packages {
          Some(p) if !p.is_empty() => manatsu::dev::build(p),
          _ => manatsu::dev::build(package::PUBLIC_PACKAGES),
        }
      }
      DevCommand::Component => {
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
      DevCommand::Composable => {
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
      DevCommand::Readme => manatsu::dev::readme(),
      DevCommand::Release => manatsu::dev::release(),
    }
  }
}
