use super::ManatsuCommand;
use anyhow::Result;
use clap::Args;
use inquire::validator::Validation;
use inquire::{required, Select, Text};
use manatsu::project::{self, Project, Template};

#[derive(Debug, Args)]
pub struct CreateCommand {
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

    let options = vec![Template::Tauri, Template::Vue];
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
