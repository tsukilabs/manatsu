use super::is_valid_name;
use crate::dev::packages;
use crate::vue::VueString;
use anyhow::{anyhow, Context, Result};
use convert_case::{Case, Casing};
use std::process::{Command, Stdio};
use std::{env, fs};

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

/// Generates an icon template.
pub fn create_icon(name: &str, icon_type: IconType) -> Result<()> {
  let name = name.to_lowercase();
  if !is_valid_name(&name)? {
    return Err(anyhow!("Invalid icon name: {}", name));
  }

  let pascal = name.to_case(Case::Pascal);

  let icon_type: &str = icon_type.into();
  let pkg_path = packages::package_dir("icons")?.join(icon_type);

  if pkg_path.try_exists()? {
    fs::create_dir_all(&pkg_path)?;
  }

  // Formats the files to ensure their structure is correct.
  format_files()?;

  let index_path = pkg_path.join("index.ts");
  let mut index = fs::read_to_string(&index_path)?;

  let icon_export = format!("export {{ default as {pascal} }} from './{pascal}.vue';\n");
  index.push_str(icon_export.as_str());
  fs::write(index_path, index)?;

  // Lint the files to ensure that the exports are sorted.
  lint_files()?;

  // Component.vue
  let vue = "<template>\n<svg></svg>\n</template>";
  let vue_path = pkg_path.join(pascal.append_vue_ext());
  fs::write(vue_path, vue)?;

  println!("Icon created: {pascal}");
  Ok(())
}

fn format_files() -> Result<()> {
  let mut command = match env::consts::OS {
    "windows" => Command::new("cmd"),
    _ => Command::new("nlx"),
  };

  if env::consts::OS == "windows" {
    command.arg("/C").arg("nlx");
  };

  command
    .args(["prettier", "icons/**/index.ts", "--write"])
    .stdout(Stdio::inherit())
    .stderr(Stdio::inherit())
    .output()
    .with_context(|| "Could not format index file before editing it")?;

  Ok(())
}

fn lint_files() -> Result<()> {
  let mut command = match env::consts::OS {
    "windows" => Command::new("cmd"),
    _ => Command::new("nlx"),
  };

  if env::consts::OS == "windows" {
    command.arg("/C").arg("nlx");
  };

  command
    .args(["eslint", "--fix", "icons/**/index.ts"])
    .stdout(Stdio::inherit())
    .stderr(Stdio::inherit())
    .output()
    .with_context(|| "Could not lint index file after editing it")?;

  Ok(())
}