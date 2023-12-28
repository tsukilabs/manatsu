use super::packages;
use anyhow::Result;
use convert_case::{Case, Casing};
use std::fs;

/// Generates a component template.
pub fn component(name: &str) -> Result<()> {
  let kebab = name.to_case(Case::Kebab);
  let pascal = name.to_case(Case::Pascal);

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

  let mut vue_filename = pascal.clone();
  vue_filename.push_str(".vue");

  let vue_path = pkg_path.join(vue_filename);
  fs::write(vue_path, vue)?;

  println!("Component created: {pascal}");
  Ok(())
}
