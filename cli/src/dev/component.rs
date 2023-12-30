mod icon;

use super::packages;
use crate::vue::VueString;
use anyhow::{anyhow, Result};
use convert_case::{Case, Casing};
pub use icon::{create_icon, IconType};
use regex::Regex;
use std::fs;

/// <https://regex101.com/r/igEb6A>
pub const COMPONENT_NAME_REGEX: &str = r"^[a-z][a-z-]*$";

/// Generates a component template.
pub fn create(name: &str) -> Result<()> {
  let name = name.to_lowercase();
  if !is_valid_name(&name)? {
    return Err(anyhow!("Invalid component name: {}", name));
  }

  let (kebab, pascal) = to_kebab_and_pascal(name);

  let pkg_path = packages::package_dir("components")?.join(kebab);
  fs::create_dir_all(&pkg_path)?;

  // index.ts
  let mut index = format!("export {{ default as M{pascal} }} from './{pascal}.vue';\n");
  index.push_str("export type * from './types';");

  let index_path = pkg_path.join("index.ts");
  fs::write(index_path, index)?;

  // types.ts
  let mut props = pascal.clone();
  props.push_str("Props");
  let types = format!("export interface {props} {{}}");

  let types_path = pkg_path.join("types.ts");
  fs::write(types_path, types)?;

  // Component.vue
  let mut vue = String::from("<script setup lang=\"ts\">\n");
  vue.push_str(format!("import type {{ {props} }} from './types';\n\n").as_str());
  vue.push_str(format!("defineProps<{props}>();\n").as_str());
  vue.push_str("</script>\n\n");
  vue.push_str("<template>\n<div></div>\n</template>\n\n");
  vue.push_str("<style scoped lang=\"scss\"></style>");

  let vue_path = pkg_path.join(pascal.append_vue_ext());
  fs::write(vue_path, vue)?;

  println!("Component created: {pascal}");
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
pub fn is_valid_name(name: &str) -> Result<bool> {
  let regex = Regex::new(COMPONENT_NAME_REGEX)?;
  Ok(regex.is_match(name))
}

fn to_kebab_and_pascal(name: String) -> (String, String) {
  let kebab = name.to_case(Case::Kebab);
  let pascal = name.to_case(Case::Pascal);
  (kebab, pascal)
}
