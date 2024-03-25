use crate::package::{self, Package};
use crate::prelude::*;
use clap::Args;

#[derive(Debug, Args)]
pub struct Build {
  #[arg(short = 'p', long, value_name = "PACKAGE")]
  package: Option<Vec<String>>,
}

impl super::Command for Build {
  /// Build the packages.
  async fn execute(self) -> Result<()> {
    let start = Instant::now();

    // The shared package must be built before anyone else.
    println!("{}", "building shared package...".bright_cyan());
    pnpm!(["run", "-F", "shared", "build"])
      .spawn()?
      .wait()
      .await?;

    let mut args = vec!["run", "--parallel"];

    let packages = self
      .package
      .unwrap_or_else(|| Package::PUBLIC.iter().map(ToString::to_string).collect())
      .into_iter()
      .map(|pkg| pkg.trim().replace("@manatsu/", "").to_case(Case::Kebab))
      .collect_vec();

    if packages.is_empty() {
      bail!("{}", "nothing to build".red());
    }

    if packages.len() == 1 && packages[0] == "shared" {
      return Ok(());
    }

    for package in &packages {
      let package = package.as_str();

      if should_build(package) {
        args.push("-F");
        args.push(package);
      }
    }

    if !args.contains(&"-F") {
      bail!("{}", "selected package(s) cannot be built".red());
    }

    args.push("build");

    println!("{}", "building other packages...".bright_cyan());
    pnpm!(args).spawn()?.wait().await?;

    println!("{}", "copying built files...".bright_cyan());
    copy_files(&packages)?;

    println!("built in {:?}", start.elapsed());
    Ok(())
  }
}

fn should_build(package: &str) -> bool {
  if Package::is_private(package) {
    return false;
  }

  // The shared package has already been built.
  package != "shared"
}

fn copy_files(packages: &Vec<String>) -> Result<()> {
  let dist = package::dist("manatsu")?;
  for pkg in packages {
    if Package::is_manual_chunk(pkg) {
      let to = dist.join(format!("{pkg}.d.ts"));
      fs::copy(package::dts(pkg)?, to)?;
    }
  }

  Ok(())
}
