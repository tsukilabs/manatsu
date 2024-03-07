use crate::prelude::*;
use colored::Colorize;
use std::fs;

#[derive(Debug, clap::Args)]
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

    let packages: Vec<String> = self
      .package
      .unwrap_or_else(|| PUBLIC_PACKAGES.iter().map(ToString::to_string).collect())
      .into_iter()
      .map(|pkg| pkg.trim().to_lowercase().replace("@manatsu/", ""))
      .collect();

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

    println!("{}", "copying files...".bright_cyan());
    copy_files(&packages)?;

    println!("built in {:?}", start.elapsed());
    Ok(())
  }
}

fn should_build(package: &str) -> bool {
  if PUBLIC_PACKAGES.contains(&package) {
    // The sass package doesn't need to be built.
    // And the shared package has already been built.
    package != "sass" && package != "shared"
  } else {
    false
  }
}

fn copy_files(packages: &Vec<String>) -> Result<()> {
  let dist = package::dist("manatsu")?;
  for pkg in packages {
    if !package::is_standalone(pkg) {
      let to = dist.join(format!("{pkg}.d.ts"));
      fs::copy(package::dts(pkg)?, to)?;
    }
  }

  Ok(())
}
