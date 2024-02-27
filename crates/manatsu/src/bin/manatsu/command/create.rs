use anyhow::Result;
use clap::Args;
use inquire::validator::Validation;
use inquire::{required, Select, Text};
use manatsu::project::{Project, Template};

#[derive(Debug, Args)]
pub struct Create {
  /// Overwrites the directory if it already exists.
  #[arg(short = 'f', long)]
  force: bool,
}

impl super::Command for Create {
  async fn execute(self) -> Result<()> {
    let validator = |name: &str| {
      if Project::is_valid(name) {
        Ok(Validation::Valid)
      } else {
        Ok(Validation::Invalid("invalid project name".into()))
      }
    };

    let project_name = Text::new("Project name")
      .with_validator(required!("project name is required"))
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

    project.create().await
  }
}
