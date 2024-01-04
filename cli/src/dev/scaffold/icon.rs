use super::component;
use crate::dev::{self, package};
use anyhow::{anyhow, bail, Result};
use convert_case::{Case, Casing};
use std::path::Path;
use std::time::Instant;
use std::{fmt, fs};

/// Generates an icon template.
pub fn create<T: AsRef<str>>(icon_type: IconType, name: T) -> Result<()> {
  let start = Instant::now();

  let name = name.as_ref();
  if !component::is_valid(name)? {
    bail!("Invalid icon name: {}", name);
  }

  let icon_type: &str = icon_type.into();
  let pascal = name.to_case(Case::Pascal);
  let dir = package::src("icons")?.join(icon_type);

  if !dir.try_exists()? {
    fs::create_dir_all(&dir)?;
  }

  // This comes first to ensure that the new icon is formatted by Prettier.
  write_vue(&pascal, &dir)?;

  // Formats the files to ensure their structure is correct.
  let glob = format!("**/icons/src/{icon_type}/**/*.{{ts,vue}}");
  dev::format_files(&glob)?;

  // Adds an export declaration to the local index.
  write_to_dir_index(&pascal, dir)?;

  // Lint the files to ensure that the exports are sorted.
  dev::lint(glob, None)?;

  println!("Icon {pascal} created in {:?}", start.elapsed());
  Ok(())
}

fn write_vue<P, D>(pascal: P, dir: D) -> Result<()>
where
  P: AsRef<str>,
  D: AsRef<Path>,
{
  let pascal = pascal.as_ref();
  let dir = dir.as_ref();

  let path = dir.join(format!("{pascal}.vue"));
  if path.try_exists()? {
    bail!("Icon {pascal} already exists");
  }

  let cts = "<template>\n<svg></svg>\n</template>";
  fs::write(path, cts)?;
  Ok(())
}

fn write_to_dir_index<P, D>(pascal: P, dir: D) -> Result<()>
where
  P: AsRef<str>,
  D: AsRef<Path>,
{
  let pascal = pascal.as_ref();
  let dir = dir.as_ref();

  let path = dir.join("index.ts");
  let mut cts = fs::read_to_string(&path)?;

  let export_decl = format!("export {{ default as {pascal} }} from './{pascal}.vue';\n");
  cts.push_str(export_decl.as_str());

  fs::write(path, cts)?;
  Ok(())
}

#[derive(Copy, Clone)]
pub enum IconType {
  Social,
}

impl TryFrom<&str> for IconType {
  type Error = anyhow::Error;

  fn try_from(value: &str) -> Result<Self> {
    let value = value.to_lowercase();
    match value.as_str() {
      "social" => Ok(IconType::Social),
      _ => Err(anyhow!("\"{}\" is not a valid icon type", value)),
    }
  }
}

impl From<IconType> for &str {
  fn from(icon_type: IconType) -> Self {
    match icon_type {
      IconType::Social => "social",
    }
  }
}

impl TryFrom<String> for IconType {
  type Error = anyhow::Error;

  fn try_from(value: String) -> Result<Self> {
    let value = value.to_lowercase();
    match value.as_str() {
      "social" => Ok(IconType::Social),
      _ => Err(anyhow!("\"{}\" is not a valid icon type", value)),
    }
  }
}

impl From<IconType> for String {
  fn from(icon_type: IconType) -> Self {
    match icon_type {
      IconType::Social => String::from("social"),
    }
  }
}

impl fmt::Display for IconType {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    let name: &str = (*self).into();
    let name = name.to_case(Case::Title);
    write!(f, "{name}")
  }
}
