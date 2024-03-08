use crate::prelude::*;
use indoc::formatdoc;

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

  update_src_index()?;

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
  let contents = formatdoc! {"
    export {{ default as M{pascal} }} from './M{pascal}.vue';
    export type * from './types';
  "};

  let path = dir.join("index.ts");
  fs::write(path, contents).map_err(Into::into)
}

fn write_typings(pascal: &str, dir: &Path) -> Result<()> {
  let contents = format!("export interface {pascal}Props {{}}");

  let path = dir.join("types.ts");
  fs::write(path, contents).map_err(Into::into)
}

fn write_vue(kebab: &str, pascal: &str, dir: &Path) -> Result<()> {
  let contents = formatdoc! {"
    <script setup lang=\"ts\">
    import type {{ {pascal}Props }} from './types';

    defineProps<{pascal}Props>();
    </script>

    <template>
      <div class=\"m-{kebab}\"></div>
    </template>

    <style lang=\"scss\">
    .m-{kebab} {{}}
    </style>
  "};

  let path = dir.join(format!("M{pascal}.vue"));
  fs::write(path, contents).map_err(Into::into)
}

fn write_test(kebab: &str, pascal: &str, dir: &Path) -> Result<()> {
  let contents = formatdoc! {"
    import {{ afterEach, describe, it }} from 'vitest';
    import {{ createManatsu }} from '@manatsu/vue-plugin/src/index.ts';
    import {{ config, enableAutoUnmount }} from '@vue/test-utils';
    // import M{pascal} from './M{pascal}.vue';

    enableAutoUnmount(afterEach);

    config.global.plugins = [createManatsu()];
    
    describe('{kebab}', () => {{ it.todo('todo'); }});
  "};

  let path = dir.join(format!("M{pascal}.test.ts"));
  fs::write(path, contents).map_err(Into::into)
}

fn update_src_index() -> Result<()> {
  let src = package::src("components")?;
  let mut components = Vec::new();

  for entry in fs::read_dir(src)? {
    if matches!(entry, Ok(ref e) if e.file_type().map(|t| t.is_dir()).unwrap_or(false)) {
      if let Ok(name) = entry?.file_name().into_string() {
        components.push(name);
      }
    }
  }

  components.sort_unstable();

  let index = package::index("components")?;
  let mut cts = String::with_capacity(components.len() * 30);

  for component in components {
    let export_decl = format!("export * from './{component}';\n");
    cts.push_str(export_decl.as_str());
  }

  fs::write(index, cts).map_err(Into::into)
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
