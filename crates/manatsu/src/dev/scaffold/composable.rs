use crate::dev::{self, package};
use anyhow::{bail, Result};
use convert_case::{Case, Casing};
use regex::Regex;
use std::fs;
use std::path::Path;
use std::time::Instant;

/// <https://regex101.com/r/vBQTOL>
pub(crate) const COMPOSABLE_NAME_REGEX: &str = r"^use(?:-?[a-zA-Z])*$";

pub fn create<T: AsRef<str>>(name: T) -> Result<()> {
  let start = Instant::now();

  let name = name.as_ref();
  if !is_valid(name)? {
    bail!("Invalid composable name: {}", name);
  }

  let camel = name.to_case(Case::Camel);
  let dir = package::src("composables")?.join(&camel);

  if !dir.try_exists()? {
    fs::create_dir_all(&dir)?;
  } else {
    bail!("Composable {camel} already exists");
  }

  write_index(&camel, &dir)?;
  write_test(&camel, dir)?;

  // Formats the files to ensure their structure is correct.
  let glob = format!("**/composables/src/{camel}/**/*.ts");
  dev::format_files(&glob)?;

  // Adds an export declaration to the src index.
  write_to_src_index(&camel)?;

  // Lint the files to ensure that the exports are sorted.
  let index_glob = vec!["**/composables/src/index.ts"];
  dev::lint(glob, Some(index_glob))?;

  println!("Composable {camel} created in {:?}", start.elapsed());
  Ok(())
}

fn write_index<C, D>(camel: C, dir: D) -> Result<()>
where
  C: AsRef<str>,
  D: AsRef<Path>,
{
  let camel = camel.as_ref();
  let cts = format!("export function {camel}() {{ /* TODO */ }}");

  let dir = dir.as_ref();
  let path = dir.join("index.ts");
  fs::write(path, cts)?;
  Ok(())
}

fn write_test<C, D>(camel: C, dir: D) -> Result<()>
where
  C: AsRef<str>,
  D: AsRef<Path>,
{
  let camel = camel.as_ref();

  let mut cts = String::from("import { describe, it } from 'vitest';\n");
  cts.push_str(format!("// import {{ {camel} }} from '.';\n\n").as_str());
  cts.push_str(format!("describe('{camel}', () => {{ it.todo('todo'); }});").as_str());

  let dir = dir.as_ref();
  let path = dir.join("index.test.ts");
  fs::write(path, cts)?;
  Ok(())
}

fn write_to_src_index<C: AsRef<str>>(camel: C) -> Result<()> {
  let camel = camel.as_ref();

  let src = package::src("composables")?;
  let path = src.join("index.ts");

  let mut cts = fs::read_to_string(&path)?;
  let export_decl = format!("export * from './{camel}';\n");
  cts.push_str(export_decl.as_str());

  fs::write(path, cts)?;
  Ok(())
}

/// Determines whether the composable name is valid.
pub fn is_valid<T: AsRef<str>>(name: T) -> Result<bool> {
  let name = name.as_ref();
  let regex = Regex::new(COMPOSABLE_NAME_REGEX)?;
  Ok(regex.is_match(name))
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn should_determine_if_name_is_valid() {
    let name = "useManatsu";
    assert!(is_valid(name).unwrap());

    let name = "composable-name";
    assert!(!is_valid(name).unwrap());
  }
}
