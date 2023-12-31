use super::component;
use crate::dev::{self, package};
use anyhow::{anyhow, Result};
use convert_case::{Case, Casing};
use std::fs;
use std::path::Path;
use std::time::Instant;

const ICON_GLOB: &str = "**/icons/src/**/*.{ts,vue}";

/// Generates an icon template.
pub fn create<T>(icon_type: IconType, name: T) -> Result<()>
where
  T: AsRef<str>,
{
  let start = Instant::now();

  let name = name.as_ref().to_lowercase();
  if !component::is_valid_name(&name)? {
    return Err(anyhow!("Invalid icon name: {}", name));
  }

  let icon_type: &str = icon_type.into();
  let pascal = name.to_case(Case::Pascal);
  let src = package::src("icons")?.join(icon_type);

  if !src.try_exists()? {
    fs::create_dir_all(&src)?;
  }

  // This comes first to ensure that the new icon is formatted by Prettier.
  write_vue(&pascal, &src)?;

  // Formats the files to ensure their structure is correct.
  dev::format_files(ICON_GLOB)?;

  // Adds an export declaration to the local index.
  write_to_dir_index(&pascal, src)?;

  // Lint the files to ensure that the exports are sorted.
  dev::lint(ICON_GLOB, None)?;

  println!("Created icon {pascal} in {:?}", start.elapsed());
  Ok(())
}

fn write_vue<P, S>(pascal: P, src: S) -> Result<()>
where
  P: AsRef<str>,
  S: AsRef<Path>,
{
  let pascal = pascal.as_ref();
  let src = src.as_ref();

  let path = src.join(format!("{pascal}.vue"));
  if path.try_exists()? {
    return Err(anyhow!("Icon already exists"));
  }

  let vue = "<template>\n<svg></svg>\n</template>";
  fs::write(path, vue)?;
  Ok(())
}

fn write_to_dir_index<P, S>(pascal: P, src: S) -> Result<()>
where
  P: AsRef<str>,
  S: AsRef<Path>,
{
  let pascal = pascal.as_ref();
  let src = src.as_ref();

  let path = src.join("index.ts");
  let mut index = fs::read_to_string(&path)?;

  let export_decl = format!("export {{ default as {pascal} }} from './{pascal}.vue';\n");
  index.push_str(export_decl.as_str());
  fs::write(path, index)?;
  Ok(())
}

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
