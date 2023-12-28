use anyhow::Result;
use clap::{Args, Parser, Subcommand};
use manatsu::dev;
use manatsu::project::template::Template;
use manatsu::project::{self, Project};

#[derive(Debug, Parser)]
#[command(name = "manatsu")]
#[command(version, about, long_about = None)]
struct ManatsuCli {
  #[command(subcommand)]
  command: Command,
}

#[derive(Debug, Subcommand)]
enum Command {
  Create(CreateCommand),

  #[command(subcommand)]
  Dev(DevCommand),
}

#[derive(Debug, Args)]
struct CreateCommand {
  /// Name of the new project.
  project_name: String,

  /// Project description.
  #[arg(short = 'd', long, value_name = "DESCRIPTION")]
  description: Option<String>,

  /// Overwrites the directory if it already exists.
  #[arg(short = 'f', long)]
  force: bool,

  /// Project template.
  #[arg(short = 't', long, value_name = "NAME")]
  template: Option<String>,
}

#[derive(Debug, Subcommand)]
enum DevCommand {
  /// Builds all the public packages.
  Build,
  /// Generates a component template.
  Component {
    /// Component name.
    name: String,
  },
  /// Synchronizes all README files of the monorepo.
  Readme,
  /// Releases a new version, publishing all the public packages.
  Release,
}

trait ManatsuCommand {
  fn execute(&self) -> Result<()>;
}

impl ManatsuCommand for CreateCommand {
  fn execute(&self) -> Result<()> {
    let template = self.template.as_deref();
    let template = template.map(|t| t.into());

    let project = Project {
      name: &self.project_name,
      description: self.description.as_deref(),
      force: self.force,
      template: template.unwrap_or(Template::Vue),
    };

    project::create(project)
  }
}

impl ManatsuCommand for DevCommand {
  fn execute(&self) -> Result<()> {
    match self {
      DevCommand::Build => dev::build(),
      DevCommand::Component { name } => dev::component(name),
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
