use super::is_valid_name;
use crate::dev::package;
use crate::vue::VueString;
use anyhow::{anyhow, Result};
use convert_case::{Case, Casing};
use std::fs;
use crate::dev::command;

const ICON_GLOB: &str = "**/icons/src/**/*.{ts,vue}";

/// Generates an icon template.
pub fn create_icon<T: AsRef<str>>(icon_type: IconType, name: T) -> Result<()> {
  let name = name.as_ref().to_lowercase();
  if !is_valid_name(&name)? {
    return Err(anyhow!("Invalid icon name: {}", name));
  }

  let pascal = name.to_case(Case::Pascal);

  let icon_type: &str = icon_type.into();
  let src = package::src("icons")?.join(icon_type);

  if src.try_exists()? {
    fs::create_dir_all(&src)?;
  }

  // This comes first to ensure that the new icon is formatted by Prettier.
  let vue = "<template>\n<svg></svg>\n</template>";
  let vue_path = src.join(pascal.append_vue_ext());
  fs::write(vue_path, vue)?;

  // Formats the files to ensure their structure is correct.
  command::format_files(ICON_GLOB)?;

  let index_path = src.join("index.ts");
  let mut index = fs::read_to_string(&index_path)?;

  let icon_export = format!("export {{ default as {pascal} }} from './{pascal}.vue';\n");
  index.push_str(icon_export.as_str());
  fs::write(index_path, index)?;

  // Lint the files to ensure that the exports are sorted.
  command::lint(ICON_GLOB, None)?;

  println!("Icon created: {pascal}");
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
