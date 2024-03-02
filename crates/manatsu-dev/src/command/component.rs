use crate::package;
use crate::util::{Formatter, Linter};
use anyhow::{bail, Result};
use colored::Colorize;
use convert_case::{Case, Casing};
use regex::Regex;
use std::fs;
use std::path::Path;
use std::time::Instant;

/// <https://regex101.com/r/igEb6A>
const NAME_REGEX: &str = r"^[a-z][a-z-]*$";

/// Generates a component template.
pub async fn create<T: AsRef<str>>(name: T) -> Result<()> {
  let start = Instant::now();

  let name = name.as_ref();
  if !is_valid(name) {
    bail!("invalid component name: {name}");
  }

  let kebab = name.to_case(Case::Kebab);
  let pascal = name.to_case(Case::Pascal);
  let dir = package::src("components")?.join(&kebab);

  if dir.try_exists()? {
    bail!("component {pascal} already exists");
  }

  fs::create_dir_all(&dir)?;

  write_index(&pascal, &dir)?;
  write_typings(&pascal, &dir)?;
  write_vue(&kebab, &pascal, &dir)?;
  write_test(&kebab, &pascal, &dir)?;
  write_to_src_index(&kebab)?;

  let glob = format!("**/components/src/{kebab}/**/*.{{ts,vue}}");
  Formatter::new(&glob).format().await?;

  Linter::new(&glob)
    .arg("--rule")
    .arg("@typescript-eslint/no-empty-interface: off")
    .arg("**/components/src/index.ts")
    .lint()
    .await?;

  let message = format!("component {pascal} created in {:?}", start.elapsed());
  println!("{}", message.bright_green());

  Ok(())
}

fn write_index(pascal: &str, dir: &Path) -> Result<()> {
  let mut index = format!("export {{ default as M{pascal} }} from './M{pascal}.vue';\n");
  index.push_str("export type * from './types';");

  let path = dir.join("index.ts");
  fs::write(path, index).map_err(Into::into)
}

fn write_typings(pascal: &str, dir: &Path) -> Result<()> {
  let cts = format!("export interface {pascal}Props {{}}");

  let path = dir.join("types.ts");
  fs::write(path, cts).map_err(Into::into)
}

fn write_vue(kebab: &str, pascal: &str, dir: &Path) -> Result<()> {
  let mut cts = String::from("<script setup lang=\"ts\">\n");
  cts.push_str(format!("import type {{ {pascal}Props }} from './types';\n\n").as_str());
  cts.push_str(format!("defineProps<{pascal}Props>();\n").as_str());
  cts.push_str("</script>\n\n");
  cts.push_str(format!("<template>\n<div class=\"m-{kebab}\"></div>\n</template>\n\n").as_str());
  cts.push_str(format!("<style lang=\"scss\">\n.m-{kebab} {{}}\n</style>").as_str());

  let path = dir.join(format!("M{pascal}.vue"));
  fs::write(path, cts).map_err(Into::into)
}

fn write_test(kebab: &str, pascal: &str, dir: &Path) -> Result<()> {
  let mut cts = String::from("import { afterEach, describe, it } from 'vitest';\n");
  cts.push_str("import { enableAutoUnmount } from '@vue/test-utils';\n");
  cts.push_str(format!("// import M{pascal} from './M{pascal}.vue';\n\n").as_str());
  cts.push_str("enableAutoUnmount(afterEach);\n\n");
  cts.push_str(format!("describe('{kebab}', () => {{ it.todo('todo'); }});").as_str());

  let path = dir.join(format!("M{pascal}.test.ts"));
  fs::write(path, cts).map_err(Into::into)
}

fn write_to_src_index(kebab: &str) -> Result<()> {
  let src = package::src("components")?;
  let path = src.join("index.ts");

  let mut cts = fs::read_to_string(&path)?;
  let export_decl = format!("export * from './{kebab}';\n");
  cts.push_str(export_decl.as_str());

  fs::write(path, cts).map_err(Into::into)
}

/// Determines whether the component name is valid.
pub fn is_valid<T: AsRef<str>>(name: T) -> bool {
  let regex = Regex::new(NAME_REGEX).expect("hardcoded regex should be valid");
  regex.is_match(name.as_ref())
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn should_determine_if_name_is_valid() {
    assert!(is_valid("button"));
    assert!(!is_valid("Select99@"));
  }
}
