use crate::prelude::*;
use crate::project::Project;
use inquire::validator::Validation;
use inquire::{required, Text};
use semver::Version;

pub trait Command {
  async fn execute(self) -> Result<()>;
}

#[derive(Debug, clap::Args)]
pub struct Create {
  /// Overwrites the directory if it already exists.
  #[arg(short = 'f', long)]
  force: bool,

  /// Version of the project.
  #[arg(short = 'v', long, value_name = "VERSION", default_value = "0.1.0")]
  version: Option<String>,
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

    let project = Project {
      name: project_name,
      description,
      force: self.force,
      version: Version::parse(self.version.as_deref().unwrap())?,
    };

    project.create().await
  }
}
