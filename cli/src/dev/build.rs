use super::package::{self, is_standalone, PACKAGES};
use anyhow::{anyhow, Result};
use miho;
use std::fs;
use std::time::Instant;

/// Build the packages.
pub fn build<I, S>(packages: I) -> Result<()>
where
  I: IntoIterator<Item = S>,
  S: AsRef<str>,
{
  let start = Instant::now();

  let mut command = miho::Command::new("pnpm");
  let mut args = vec!["run", "--parallel"];

  let iter = packages.into_iter();
  let packages = iter.map(|pkg| -> String {
    let pkg = pkg.as_ref();
    let pkg = pkg.trim().to_lowercase();
    pkg.replace("@manatsu/", "")
  });

  let packages = packages.filter(|pkg| PACKAGES.contains(&pkg.as_str()));

  let packages: Vec<String> = packages.collect();
  if packages.is_empty() {
    return Err(anyhow!("Nothing to build"));
  }

  for pkg in &packages {
    args.push("--filter");
    args.push(pkg);
  }

  args.push("build");

  command.args(args).stdio(miho::Stdio::Inherit).output()?;

  println!("Copying files...");
  copy_files(&packages)?;

  println!("Fixing type exports...");
  fix_exports(&packages)?;

  println!("Built in: {:?}", start.elapsed());
  Ok(())
}

fn copy_files(packages: &Vec<String>) -> Result<()> {
  let dist = package::dist("manatsu")?;
  for pkg in packages {
    if !is_standalone(pkg) {
      let to = dist.join(format!("{pkg}.d.ts"));
      fs::copy(package::dts(pkg)?, to)?;
    }
  }

  Ok(())
}

fn fix_exports(packages: &Vec<String>) -> Result<()> {
  let dts = package::dts("manatsu")?;
  let mut content = fs::read_to_string(&dts)?;

  for pkg in packages {
    if !is_standalone(pkg) {
      content = content.replace(
        format!("@manatsu/{pkg}/src/index.ts").as_str(),
        format!("./{pkg}").as_str(),
      );
    }
  }

  fs::write(dts, content)?;
  Ok(())
}
