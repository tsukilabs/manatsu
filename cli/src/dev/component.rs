mod icon;

use super::command;
use super::package;
use anyhow::{anyhow, Result};
use convert_case::{Case, Casing};
pub use icon::{create_icon, IconType};
use regex::Regex;
use std::fs;
use std::path::Path;
use std::time::Instant;

/// <https://regex101.com/r/igEb6A>
pub const COMPONENT_NAME_REGEX: &str = r"^[a-z][a-z-]*$";

/// Generates a component template.
pub fn create<T>(name: T) -> Result<()>
where
  T: AsRef<str>,
{
  let start = Instant::now();

  let name = name.as_ref().to_lowercase();
  if !is_valid_name(&name)? {
    return Err(anyhow!("Invalid component name: {}", name));
  }

  let kebab = name.to_case(Case::Kebab);
  let pascal = name.to_case(Case::Pascal);
  let src = package::src("components")?.join(&kebab);

  if !src.try_exists()? {
    fs::create_dir_all(&src)?;
  } else {
    return Err(anyhow!("Component already exists"));
  }

  write_index(&pascal, &src)?;
  write_typings(&pascal, &src)?;
  write_vue(&pascal, &src)?;
  write_test(&kebab, &pascal, src)?;

  let glob = format!("**/components/src/{kebab}/**/*.{{ts,vue}}");
  command::format_files(&glob)?;

  let args = vec!["--rule", "@typescript-eslint/no-empty-interface: off"];
  command::lint(glob, Some(args))?;

  println!("Created component {pascal} in {:?}", start.elapsed());
  Ok(())
}

fn write_index<P, S>(pascal: P, src: S) -> Result<()>
where
  P: AsRef<str>,
  S: AsRef<Path>,
{
  let pascal = pascal.as_ref();
  let mut index = format!("export {{ default as M{pascal} }} from './{pascal}.vue';\n");
  index.push_str("export type * from './types';");

  let src = src.as_ref();
  let index_path = src.join("index.ts");
  fs::write(index_path, index)?;
  Ok(())
}

fn write_typings<P, S>(pascal: P, src: S) -> Result<()>
where
  P: AsRef<str>,
  S: AsRef<Path>,
{
  let pascal = pascal.as_ref();
  let props = format!("{pascal}Props");
  let props_interface = format!("export interface {props} {{}}");

  let src = src.as_ref();
  let path = src.join("types.ts");
  fs::write(path, props_interface)?;
  Ok(())
}

fn write_vue<P, S>(pascal: P, src: S) -> Result<()>
where
  P: AsRef<str>,
  S: AsRef<Path>,
{
  let pascal = pascal.as_ref();
  let props = format!("{pascal}Props");

  let mut vue = String::from("<script setup lang=\"ts\">\n");
  vue.push_str(format!("import type {{ {props} }} from './types';\n\n").as_str());
  vue.push_str(format!("defineProps<{props}>();\n").as_str());
  vue.push_str("</script>\n\n");
  vue.push_str("<template>\n<div></div>\n</template>\n\n");
  vue.push_str("<style scoped lang=\"scss\"></style>");

  let src = src.as_ref();
  let path = src.join(format!("{pascal}.vue"));
  fs::write(path, vue)?;
  Ok(())
}

fn write_test<P, S>(kebab: P, pascal: P, src: S) -> Result<()>
where
  P: AsRef<str>,
  S: AsRef<Path>,
{
  let kebab = kebab.as_ref();
  let pascal = pascal.as_ref();

  let mut test = String::from("import { afterEach, describe, it } from 'vitest';\n");
  test.push_str("import { enableAutoUnmount } from '@vue/test-utils';\n");
  test.push_str(format!("import {pascal} from './{pascal}.vue';\n\n").as_str());
  test.push_str("enableAutoUnmount(afterEach);\n\n");
  test.push_str(format!("describe('{kebab}', () => {{ it.todo('todo'); }});").as_str());

  let src = src.as_ref();
  let path = src.join(format!("{pascal}.test.ts"));
  fs::write(path, test)?;
  Ok(())
}

/// Determines whether the component name is valid.
///
/// # Examples
/// ```
/// use manatsu::dev::component::is_valid_name;
///
/// let name = "button";
/// assert!(is_valid_name(name).unwrap());
///
/// let name = "Select99@";
/// assert!(!is_valid_name(name).unwrap());
/// ```
pub fn is_valid_name<T>(name: T) -> Result<bool>
where
  T: AsRef<str>,
{
  let name = name.as_ref();
  let regex = Regex::new(COMPONENT_NAME_REGEX)?;
  Ok(regex.is_match(name))
}
