pub mod packages;

use self::packages::PACKAGES;
use std::time::Instant;
use anyhow::{anyhow, Result};
use convert_case::{Case, Casing};
use std::env;
use std::fs;
use std::process::{Command, Stdio};
use std::thread;

/// Build all public packages.
pub fn build() -> Result<()> {
  let start = Instant::now();
  let mut handles = vec![];

  for pkg in PACKAGES {
    let builder = thread::Builder::new().name(pkg.to_string());
    let handle = builder.spawn(move || {
      let pkg_name = match pkg {
        "manatsu" => pkg.to_string(),
        _ => format!("@manatsu/{pkg}"),
      };

      println!("Building: {pkg_name}");
      let mut command = match env::consts::OS {
        "windows" => Command::new("cmd"),
        _ => Command::new("sh"),
      };

      match env::consts::OS {
        "windows" => command.arg("/C"),
        _ => command.arg("-c"),
      };

      let output = command
        .arg("pnpm")
        .args(["-F", pkg_name.as_str(), "build"])
        .stdout(Stdio::null())
        .stderr(Stdio::null())
        .output()
        .unwrap();

      assert!(output.status.success());
      println!("Done: {pkg_name}");
    });

    match handle {
      Ok(h) => handles.push(h),
      Err(e) => panic!("{:?}", e),
    }
  }

  for handle in handles {
    let pkg_name = handle.thread().name().unwrap().to_owned();
    if let Err(_) = handle.join() {
      return Err(anyhow!("Could not build \"{pkg_name}\"."));
    }
  }

  println!("Copying files...");
  let dist = packages::dist("manatsu")?;
  for pkg in PACKAGES {
    if pkg == "manatsu" {
      continue;
    }

    let to = dist.join(format!("{pkg}.d.ts"));
    fs::copy(packages::dts(pkg)?, to)?;
  }

  println!("Fixing type exports...");
  let dts = packages::dts("manatsu")?;
  let mut content = fs::read_to_string(&dts)?;

  for pkg in PACKAGES {
    if pkg == "manatsu" {
      continue;
    }

    content = content.replace(
      format!("@manatsu/{pkg}/index.ts").as_str(),
      format!("./{pkg}").as_str(),
    );
  }

  fs::write(dts, content)?;
  
  println!("Built in: {:?}", start.elapsed());
  Ok(())
}

/// Generate component template.
pub fn component(name: &str) -> Result<()> {
  let kebab = name.to_case(Case::Kebab);
  let pascal = name.to_case(Case::Pascal);

  let pkg_path = packages::root("components")?.join(kebab);
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

/// Copy root README file to each package folder.
pub fn readme() -> Result<()> {
  let filename = "README.md";
  let cwd = env::current_dir()?;
  let src_readme = cwd.join(filename);

  for pkg in packages::PACKAGES {
    let dest_readme = packages::root(pkg)?.join(filename);
    fs::copy(&src_readme, &dest_readme)?;
    println!("Copied: {}", dest_readme.display());
  }

  println!("Done!");
  Ok(())
}
