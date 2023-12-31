mod icon;

use super::command;
use super::package;
use anyhow::{anyhow, Result};
use convert_case::{Case, Casing};
pub use icon::{create_icon, IconType};
use regex::Regex;
use std::fs;
use std::time::Instant;

/// <https://regex101.com/r/igEb6A>
pub const COMPONENT_NAME_REGEX: &str = r"^[a-z][a-z-]*$";

/// Generates a component template.
pub fn create<T: AsRef<str>>(name: T) -> Result<()> {
  let start = Instant::now();

  let name = name.as_ref().to_lowercase();
  if !is_valid_name(&name)? {
    return Err(anyhow!("Invalid component name: {}", name));
  }

  let kebab = name.to_case(Case::Kebab);
  let pascal = name.to_case(Case::Pascal);

  let src = package::src("components")?.join(&kebab);
  fs::create_dir_all(&src)?;

  // index.ts
  let mut index = format!("export {{ default as M{pascal} }} from './{pascal}.vue';\n");
  index.push_str("export type * from './types';");

  let index_path = src.join("index.ts");
  fs::write(index_path, index)?;

  // types.ts
  let mut props = pascal.clone();
  props.push_str("Props");
  let types = format!("export interface {props} {{}}");

  let types_path = src.join("types.ts");
  fs::write(types_path, types)?;

  // Component.vue
  let mut vue = String::from("<script setup lang=\"ts\">\n");
  vue.push_str(format!("import type {{ {props} }} from './types';\n\n").as_str());
  vue.push_str(format!("defineProps<{props}>();\n").as_str());
  vue.push_str("</script>\n\n");
  vue.push_str("<template>\n<div></div>\n</template>\n\n");
  vue.push_str("<style scoped lang=\"scss\"></style>");

  let vue_path = src.join(format!("{pascal}.vue"));
  fs::write(vue_path, vue)?;

  let glob = get_component_glob(kebab);
  command::format_files(&glob)?;

  let args = vec!["--rule", "@typescript-eslint/no-empty-interface: off"];
  command::lint(glob, Some(args))?;

  println!("Created component {pascal} in {:?}", start.elapsed());
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
pub fn is_valid_name<T: AsRef<str>>(name: T) -> Result<bool> {
  let name = name.as_ref();
  let regex = Regex::new(COMPONENT_NAME_REGEX)?;
  Ok(regex.is_match(name))
}

fn get_component_glob<T: AsRef<str>>(name: T) -> String {
  let name = name.as_ref();
  format!("**/components/src/{name}/**/*.{{ts,vue}}")
}
