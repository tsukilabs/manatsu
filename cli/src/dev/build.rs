use super::packages::{self, PACKAGES};
use anyhow::Result;
use std::env;
use std::fs;
use std::process::{Command, Stdio};
use std::time::Instant;

/// Builds all the public packages.
pub fn build() -> Result<()> {
  let start = Instant::now();

  let mut command = match env::consts::OS {
    "windows" => Command::new("cmd"),
    _ => Command::new("pnpm"),
  };

  if env::consts::OS == "windows" {
    command.arg("/C").arg("pnpm");
  };

  let mut args = vec!["run", "--parallel"];
  for pkg in PACKAGES {
    args.push("--filter");
    args.push(pkg);
  }

  args.push("build");

  command
    .args(args)
    .stdout(Stdio::inherit())
    .stderr(Stdio::inherit())
    .output()?;

  copy_files()?;
  fix_exports()?;

  println!("Built in: {:?}", start.elapsed());
  Ok(())
}

fn copy_files() -> Result<()> {
  println!("Copying files...");
  let dist = packages::dist_dir("manatsu")?;
  for pkg in PACKAGES {
    if pkg != "manatsu" {
      let to = dist.join(format!("{pkg}.d.ts"));
      fs::copy(packages::dts_file(pkg)?, to)?;
    }
  }

  Ok(())
}

fn fix_exports() -> Result<()> {
  println!("Fixing type exports...");
  let dts = packages::dts_file("manatsu")?;
  let mut content = fs::read_to_string(&dts)?;

  for pkg in PACKAGES {
    if pkg != "manatsu" {
      content = content.replace(
        format!("@manatsu/{pkg}/index.ts").as_str(),
        format!("./{pkg}").as_str(),
      );
    }
  }

  fs::write(dts, content)?;
  Ok(())
}
