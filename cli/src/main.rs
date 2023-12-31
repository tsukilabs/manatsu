use anyhow::Result;
use clap::{Args, Parser, Subcommand};
use inquire::validator::Validation;
use inquire::{required, Select, Text};
use manatsu::dev;
use manatsu::dev::scaffold::icon::{self, IconType};
use manatsu::dev::scaffold::{component, composable};
use manatsu::project::{self, Project, Template};

#[derive(Debug, Parser)]
#[command(name = "manatsu")]
#[command(version, about, long_about = None)]
struct ManatsuCli {
  #[command(subcommand)]
  command: Command,
}

#[derive(Debug, Subcommand)]
enum Command {
  /// Easily create a new project.
  Create(CreateCommand),

  /// Helpful commands when contributing to Manatsu.
  #[command(subcommand)]
  Dev(DevCommand),
}

trait ManatsuCommand {
  fn execute(&self) -> Result<()>;
}

#[derive(Debug, Args)]
struct CreateCommand {
  /// Overwrites the directory if it already exists.
  #[arg(short = 'f', long)]
  force: bool,
}

impl ManatsuCommand for CreateCommand {
  fn execute(&self) -> Result<()> {
    let validator = |name: &str| {
      if project::is_valid(name)? {
        Ok(Validation::Valid)
      } else {
        Ok(Validation::Invalid("Invalid component name".into()))
      }
    };

    let project_name = Text::new("Project name")
      .with_validator(required!("Project name is required"))
      .with_validator(validator)
      .prompt()?;

    let description = Text::new("Description").prompt_skippable()?;

    let options = vec![Template::Vue];
    let template = Select::new("Select a template", options).prompt()?;

    let project = Project {
      name: project_name,
      description,
      force: self.force,
      template,
    };

    project.create()
  }
}

#[derive(Debug, Subcommand)]
enum DevCommand {
  /// Builds all the public packages.
  Build {
    /// If present, only the indicated packages will be built.
    packages: Option<Vec<String>>,
  },
  /// Generates a component template.
  Component,
  /// Generates a composable template.
  Composable,
  /// Generates a icon template.
  Icon,
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
          Some(p) if !p.is_empty() => dev::build(p),
          _ => dev::build(dev::package::PACKAGES),
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
      DevCommand::Icon => {
        let validator = |name: &str| {
          if component::is_valid(name)? {
            Ok(Validation::Valid)
          } else {
            Ok(Validation::Invalid("Invalid icon name".into()))
          }
        };

        let name = Text::new("Icon name")
          .with_validator(required!("Icon name is required"))
          .with_validator(validator)
          .prompt()?;

        let options = vec![IconType::Social];
        let icon_type = Select::new("Select an icon type", options).prompt()?;
        icon::create(icon_type, name)
      }
      DevCommand::Readme => dev::readme(),
      DevCommand::Release => dev::release(),
    }
  }
}

fn main() -> Result<()> {
  let cli = ManatsuCli::parse();

  match cli.command {
    Command::Create(cmd) => cmd.execute(),
    Command::Dev(cmd) => cmd.execute(),
  }
}
