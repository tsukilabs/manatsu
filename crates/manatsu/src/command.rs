use crate::project::Project;
use anyhow::Result;
use inquire::validator::Validation;
use inquire::{required, Text};
use semver::Version;

pub trait Command {
  async fn execute(self) -> Result<()>;
}

#[derive(Debug, clap::Args)]
pub struct Create {
  #[arg(short = 'a', long, value_name = "AUTHOR")]
  author: Option<String>,

  #[arg(short = 'd', long, value_name = "DESCRIPTION")]
  description: Option<String>,

  /// Overwrites the directory if it already exists.
  #[arg(short = 'f', long)]
  force: bool,

  #[arg(short = 'n', long, value_name = "NAME")]
  name: Option<String>,

  #[arg(short = 'v', long, value_name = "VERSION", default_value = "0.1.0")]
  version: Option<String>,
}

impl super::Command for Create {
  async fn execute(mut self) -> Result<()> {
    let validator = |name: &str| {
      if Project::is_valid(name) {
        Ok(Validation::Valid)
      } else {
        Ok(Validation::Invalid("invalid project name".into()))
      }
    };

    let name = self.name.unwrap_or_else(|| {
      Text::new("Project name")
        .with_validator(required!("project name is required"))
        .with_validator(validator)
        .prompt()
        .unwrap()
    });

    if self.description.is_none() {
      self.description = Text::new("Description").prompt_skippable()?;
    }

    if self.author.is_none() {
      self.author = Text::new("Author").prompt_skippable()?;
    }

    let project = Project {
      name,
      description: self.description,
      author: self.author,
      force: self.force,
      version: Version::parse(self.version.as_deref().unwrap())?,
    };

    project.create().await
  }
}
