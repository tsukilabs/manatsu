use crate::dev::{self, package};
use anyhow::{anyhow, Result};
use convert_case::{Case, Casing};
use regex::Regex;
use std::fs;
use std::path::Path;
use std::time::Instant;

/// <https://regex101.com/r/igEb6A>
pub(crate) const COMPONENT_NAME_REGEX: &str = r"^[a-z][a-z-]*$";

/// Generates a component template.
pub fn create<T>(name: T) -> Result<()>
where
  T: AsRef<str>,
{
  let start = Instant::now();

  let name = name.as_ref();
  if !is_valid_name(name)? {
    return Err(anyhow!("Invalid component name: {}", name));
  }

  let kebab = name.to_case(Case::Kebab);
  let pascal = name.to_case(Case::Pascal);
  let dir = package::src("components")?.join(&kebab);

  if !dir.try_exists()? {
    fs::create_dir_all(&dir)?;
  } else {
    return Err(anyhow!("Component {pascal} already exists"));
  }

  write_index(&pascal, &dir)?;
  write_typings(&pascal, &dir)?;
  write_vue(&pascal, &dir)?;
  write_test(&kebab, &pascal, dir)?;

  let glob = format!("**/components/src/{kebab}/**/*.{{ts,vue}}");
  dev::format_files(&glob)?;

  let args = vec!["--rule", "@typescript-eslint/no-empty-interface: off"];
  dev::lint(glob, Some(args))?;

  println!("Component {pascal} created in {:?}", start.elapsed());
  Ok(())
}

fn write_index<P, D>(pascal: P, dir: D) -> Result<()>
where
  P: AsRef<str>,
  D: AsRef<Path>,
{
  let pascal = pascal.as_ref();
  let mut index = format!("export {{ default as M{pascal} }} from './{pascal}.vue';\n");
  index.push_str("export type * from './types';");

  let dir = dir.as_ref();
  let path = dir.join("index.ts");
  fs::write(path, index)?;
  Ok(())
}

fn write_typings<P, D>(pascal: P, dir: D) -> Result<()>
where
  P: AsRef<str>,
  D: AsRef<Path>,
{
  let pascal = pascal.as_ref();
  let cts = format!("export interface {pascal}Props {{}}");

  let dir = dir.as_ref();
  let path = dir.join("types.ts");
  fs::write(path, cts)?;
  Ok(())
}

fn write_vue<P, D>(pascal: P, dir: D) -> Result<()>
where
  P: AsRef<str>,
  D: AsRef<Path>,
{
  let pascal = pascal.as_ref();

  let mut cts = String::from("<script setup lang=\"ts\">\n");
  cts.push_str(format!("import type {{ {pascal}Props }} from './types';\n\n").as_str());
  cts.push_str(format!("defineProps<{pascal}Props>();\n").as_str());
  cts.push_str("</script>\n\n");
  cts.push_str("<template>\n<div></div>\n</template>\n\n");
  cts.push_str("<style scoped lang=\"scss\"></style>");

  let dir = dir.as_ref();
  let path = dir.join(format!("{pascal}.vue"));
  fs::write(path, cts)?;
  Ok(())
}

fn write_test<P, D>(kebab: P, pascal: P, dir: D) -> Result<()>
where
  P: AsRef<str>,
  D: AsRef<Path>,
{
  let kebab = kebab.as_ref();
  let pascal = pascal.as_ref();

  let mut cts = String::from("import { afterEach, describe, it } from 'vitest';\n");
  cts.push_str("import { enableAutoUnmount } from '@vue/test-utils';\n");
  cts.push_str(format!("import {pascal} from './{pascal}.vue';\n\n").as_str());
  cts.push_str("enableAutoUnmount(afterEach);\n\n");
  cts.push_str(format!("describe('{kebab}', () => {{ it.todo('todo'); }});").as_str());

  let dir = dir.as_ref();
  let path = dir.join(format!("{pascal}.test.ts"));
  fs::write(path, cts)?;
  Ok(())
}

/// Determines whether the component name is valid.
pub(crate) fn is_valid_name<T>(name: T) -> Result<bool>
where
  T: AsRef<str>,
{
  let name = name.as_ref();
  let regex = Regex::new(COMPONENT_NAME_REGEX)?;
  Ok(regex.is_match(name))
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn should_determine_if_name_is_valid() {
    let name = "button";
    assert!(is_valid_name(name).unwrap());

    let name = "Select99@";
    assert!(!is_valid_name(name).unwrap());
  }
}
