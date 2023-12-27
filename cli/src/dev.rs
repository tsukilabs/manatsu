mod build;
mod json;
mod packages;
pub use build::build;

use anyhow::Result;
use convert_case::{Case, Casing};
use std::env;
use std::fs;
use std::process::{Command, Stdio};

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

  println!("Copying README files...");
  for pkg in packages::PACKAGES {
    let dest_readme = packages::root(pkg)?.join(filename);
    fs::copy(&src_readme, &dest_readme)?;
    println!("Copied: {}", dest_readme.display());
  }

  println!("Done!");
  Ok(())
}

/// Release a new version.
pub fn release() -> Result<()> {
  readme()?;
  let config = json::read_config().ok();

  match config {
    Some(c) if c.github => {
      let package = json::read_package()?;

      let base_url = "https://api.github.com";
      let owner_repo = "manatsujs/manatsu";
      let body = ureq::json!({
        "tag_name": format!("v{}", package.version),
        "name": format!("v{}", package.version),
        "draft": false,
        "prerelease": true,
        "generate_release_notes": true
      });

      let endpoint = format!("{base_url}/repos/{owner_repo}/releases");
      let github_token = format!("Bearer {}", c.github_token);

      ureq::post(&endpoint)
        .set("Authorization", &github_token)
        .set("X-GitHub-Api-Version", "2022-11-28")
        .set("accept", "application/vnd.github+json")
        .send_json(body)?;
    }
    _ => {
      let mut command = match env::consts::OS {
        "windows" => Command::new("cmd"),
        _ => Command::new("pnpm"),
      };

      if env::consts::OS == "windows" {
        command.arg("/C").arg("pnpm");
      };

      command
        .args(["publish", "-r", "--no-git-checks"])
        .stdout(Stdio::inherit())
        .stderr(Stdio::inherit())
        .output()?;
    }
  }

  let manifest_path = "--manifest-path=cli/Cargo.toml";
  Command::new("cargo")
    .args(["publish", manifest_path])
    .stdout(Stdio::inherit())
    .stderr(Stdio::inherit())
    .output()?;

  Ok(())
}
