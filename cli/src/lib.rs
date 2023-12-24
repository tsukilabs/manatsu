use convert_case::{Case, Casing};
use std::env;
use std::error::Error;
use std::fs;
use std::path::PathBuf;

/// Manatsu package names.
pub const PACKAGES: [&str; 3] = ["manatsu", "components", "composables"];

/// Copy root README file to each package folder.
pub fn readme() -> Result<(), Box<dyn Error>> {
  let filename = "README.md";
  let cwd = env::current_dir()?;
  let src_readme = cwd.join(filename);

  for pkg in PACKAGES {
    let dest_readme = get_package_path(pkg)?.join(filename);
    fs::copy(&src_readme, &dest_readme)?;
    println!("Copied: {}", dest_readme.display());
  }

  println!("Done!");
  Ok(())
}

/// Generate component template.
pub fn component(name: &str) -> Result<(), Box<dyn Error>> {
  let kebab_name = name.to_case(Case::Kebab);
  let pkg_path = get_package_path("components")?.join(kebab_name);
  fs::create_dir_all(&pkg_path)?;

  let pascal_name = name.to_case(Case::Pascal);

  // index.ts
  let mut index = format!(
    "export {{ default as M{} }} from './{}.vue';\n",
    pascal_name, pascal_name
  );
  index.push_str("export type * from './types';");

  let index_path = pkg_path.join("index.ts");
  fs::write(index_path, index)?;

  // types.ts
  let mut props = pascal_name.clone();
  props.push_str("Props");
  let types = format!("export interface {} {{}}", props);

  let types_path = pkg_path.join("types.ts");
  fs::write(types_path, types)?;

  // Component.vue
  let mut vue = String::from("<script setup lang=\"ts\">\n");
  vue.push_str(format!("import type {{ {} }} from './types';\n\n", props).as_str());
  vue.push_str(format!("defineProps<{}>();\n", props).as_str());
  vue.push_str("</script>\n\n");
  vue.push_str("<template>\n<div></div>\n</template>\n\n");
  vue.push_str("<style scoped lang=\"scss\"></style>");

  let mut vue_filename = pascal_name.clone();
  vue_filename.push_str(".vue");

  let vue_path = pkg_path.join(vue_filename);
  fs::write(vue_path, vue)?;

  Ok(())
}

/// Returns the path to a package.
pub fn get_package_path(pkg_name: &str) -> Result<PathBuf, Box<dyn Error>> {
  let cwd = env::current_dir()?;
  let path = cwd.join("packages").join(pkg_name);
  Ok(path)
}

/// Returns the path to the dist folder of a given package.
pub fn get_package_dist_path(pkg_name: &str) -> Result<PathBuf, Box<dyn Error>> {
  let path = get_package_path(pkg_name)?.join("dist");
  Ok(path)
}
