mod build;
pub mod component;
mod json;
mod packages;
mod release;

pub use build::build;
pub use release::release;

use anyhow::Result;
use std::{env, fs};

/// Synchronizes all README files of the monorepo.
pub fn readme() -> Result<()> {
  let filename = "README.md";
  let cwd = env::current_dir()?;
  let src_readme = cwd.join(filename);

  println!("Copying README files...");
  for pkg in packages::PACKAGES {
    let dest_readme = packages::package_dir(pkg)?.join(filename);
    fs::copy(&src_readme, &dest_readme)?;
    println!("Copied: {}", dest_readme.display());
  }

  let cli_readme = cwd.join("cli").join(filename);
  fs::copy(&src_readme, &cli_readme)?;
  println!("Copied: {}", cli_readme.display());

  println!("Done!");
  Ok(())
}
