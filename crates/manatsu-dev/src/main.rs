mod command;
mod macros;
mod package;
mod prelude;
mod utils;

use clap::Parser;
use command::{Build, Command, Release};
use prelude::*;

#[derive(Debug, Parser)]
#[command(name = "manatsu-dev")]
#[command(version, about, long_about = None)]
enum Cli {
  /// Build all the public packages.
  Build(Build),
  /// Update plugin commands.
  Plugin,
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
    Cli::Plugin => command::plugin().await,
    Cli::Readme => command::readme(),
    Cli::Release(cmd) => cmd.execute().await,
  }
}
