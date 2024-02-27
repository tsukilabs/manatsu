use crate::package;
use anyhow::Result;
use colored::Colorize;
use std::{env, fs};

/// Synchronizes all README files of the monorepo.
pub fn readme() -> Result<()> {
  let filename = "README.md";
  let root_readme = env::current_dir()?.join(filename);

  println!("{}", "copying README files...".bright_cyan());
  for pkg in package::all() {
    let readme = package::dir(pkg)?.join(filename);
    fs::copy(&root_readme, &readme)?;
    println!("copied: {}", readme.display());
  }

  println!("{}", "done!".bright_green());
  Ok(())
}
