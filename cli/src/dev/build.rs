use super::packages::{self, is_standalone, PACKAGES};
use anyhow::Result;
use std::process::{Command, Stdio};
use std::time::Instant;
use std::{env, fs};

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

  println!("Copying files...");
  copy_files()?;

  println!("Fixing type exports...");
  fix_exports()?;

  println!("Built in: {:?}", start.elapsed());
  Ok(())
}

fn copy_files() -> Result<()> {
  let dist = packages::dist_dir("manatsu")?;
  for pkg in PACKAGES {
    if !is_standalone(pkg) {
      let to = dist.join(format!("{pkg}.d.ts"));
      fs::copy(packages::dts_file(pkg)?, to)?;
    }
  }

  Ok(())
}

fn fix_exports() -> Result<()> {
  let dts = packages::dts_file("manatsu")?;
  let mut content = fs::read_to_string(&dts)?;

  for pkg in PACKAGES {
    if !is_standalone(pkg) {
      content = content.replace(
        format!("@manatsu/{pkg}/index.ts").as_str(),
        format!("./{pkg}").as_str(),
      );
    }
  }

  fs::write(dts, content)?;
  Ok(())
}
