use super::packages::{self, PACKAGES};
use anyhow::{anyhow, Result};
use std::env;
use std::fs;
use std::process::{Command, Stdio};
use std::thread;
use std::time::Instant;

/// Build all public packages.
pub fn build() -> Result<()> {
  let start = Instant::now();
  let mut handles = vec![];

  for pkg in PACKAGES {
    let builder = thread::Builder::new().name(pkg.to_string());
    let handle = builder.spawn(move || {
      let pkg_name = match pkg {
        "manatsu" => pkg.to_string(),
        _ => format!("@manatsu/{pkg}"),
      };

      println!("Building: {pkg_name}");
      let mut command = match env::consts::OS {
        "windows" => Command::new("cmd"),
        _ => Command::new("pnpm"),
      };

      if env::consts::OS == "windows" {
        command.arg("/C").arg("pnpm");
      };

      let output = command
        .args(["-F", pkg_name.as_str(), "build"])
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .output()
        .unwrap();

      assert!(output.status.success());
      println!("Done: {pkg_name}");
    });

    match handle {
      Ok(h) => handles.push(h),
      Err(e) => panic!("{:?}", e),
    }
  }

  for handle in handles {
    let pkg_name = handle.thread().name().unwrap().to_owned();
    if handle.join().is_err() {
      return Err(anyhow!("Could not build \"{pkg_name}\"."));
    }
  }

  println!("Copying files...");
  let dist = packages::dist("manatsu")?;
  for pkg in PACKAGES {
    if pkg == "manatsu" {
      continue;
    }

    let to = dist.join(format!("{pkg}.d.ts"));
    fs::copy(packages::dts(pkg)?, to)?;
  }

  println!("Fixing type exports...");
  let dts = packages::dts("manatsu")?;
  let mut content = fs::read_to_string(&dts)?;

  for pkg in PACKAGES {
    if pkg == "manatsu" {
      continue;
    }

    content = content.replace(
      format!("@manatsu/{pkg}/index.ts").as_str(),
      format!("./{pkg}").as_str(),
    );
  }

  fs::write(dts, content)?;

  println!("Built in: {:?}", start.elapsed());
  Ok(())
}
