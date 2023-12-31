use anyhow::Result;
use clap::{Args, Parser, Subcommand};
use manatsu::dev;
use manatsu::dev::component::{self, IconType};
use manatsu::project::{Project, Template};

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
  Component {
    /// Component name.
    name: String,
  },
  /// Generates a icon template.
  Icon {
    /// Icon type.
    icon_type: String,
    /// Icon name.
    name: String,
  },
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
      DevCommand::Component { name } => component::create(name),
      DevCommand::Icon { icon_type, name } => {
        let icon_type = IconType::try_from(icon_type.as_str())?;
        component::create_icon(icon_type, name)
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
