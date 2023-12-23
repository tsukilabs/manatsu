use std::env;
use std::error::Error;
use std::fs;
use std::path::PathBuf;

/// Manatsu package names.
pub const PACKAGES: [&str; 3] = ["manatsu", "components", "composables"];

/// Copies root README file to each package folder.
pub fn readme() -> Result<(), Box<dyn Error>> {
  let file = "README.md";
  let cwd = env::current_dir()?;
  let src_readme = cwd.join(file);

  for pkg in PACKAGES {
    let dest_readme = get_package_path(pkg)?.join(file);
    fs::copy(&src_readme, &dest_readme)?;
    println!("Copied: {}", dest_readme.display());
  }

  println!("Done!");
  Ok(())
}

/// Returns the path to a package.
pub fn get_package_path(pkg_name: &str) -> Result<PathBuf, Box<dyn Error>> {
  let cwd = env::current_dir()?;
  let path = cwd.join("packages").join(pkg_name);
  Ok(path)
}

/// Returns the path to the dist folder of a given package.
pub fn get_package_dist_path(pkg_name: &str) -> Result<PathBuf, Box<dyn Error>> {
  let path = get_package_path(pkg_name)?.join("dist");
  Ok(path)
}
