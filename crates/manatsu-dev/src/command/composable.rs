use crate::package;
use crate::prelude::*;
use crate::utils::{Formatter, Linter};

/// <https://regex101.com/r/vBQTOL>
const NAME_REGEX: &str = r"^(define|on|use)(?:-?[a-zA-Z])*$";

pub async fn create<T: AsRef<str>>(name: T) -> Result<()> {
  let start = Instant::now();

  let name = name.as_ref();
  if !is_valid(name) {
    bail!("invalid composable name: {name}");
  }

  let camel = name.to_case(Case::Camel);
  let dir = package::src("composables")?.join(&camel);

  if dir.try_exists()? {
    bail!("composable {camel} already exists");
  }

  fs::create_dir_all(&dir)?;

  write_index(&camel, &dir)?;
  write_test(&camel, &dir)?;

  // Formats the files to ensure their structure is correct.
  let glob = format!("**/composables/src/{camel}/**/*.ts");
  Formatter::new(&glob).format().await?;

  // Adds an export declaration to the src index.
  update_src_index()?;

  // Lint the files to ensure that the exports are sorted.
  Linter::new(&glob)
    .arg("**/composables/src/index.ts")
    .lint()
    .await?;

  let message = format!("composable {camel} created in {:?}", start.elapsed());
  println!("{}", message.bright_green());

  Ok(())
}

fn write_index(camel: &str, dir: &Path) -> Result<()> {
  let contents = formatdoc! {"
    import {{ type MaybeRefOrGetter, toRef }} from 'vue';

    export function {camel}() {{ /* TODO */ }}
  "};

  let path = dir.join("index.ts");
  fs::write(path, contents).map_err(Into::into)
}

fn write_test(camel: &str, dir: &Path) -> Result<()> {
  let contents = formatdoc! {"
    import {{ describe, it }} from 'vitest';

    // import {{ {camel} }} from '.';

    describe('{camel}', () => {{
      it.todo('todo');
    }});
  "};

  let path = dir.join("index.test.ts");
  fs::write(path, contents).map_err(Into::into)
}

fn update_src_index() -> Result<()> {
  let src = package::src("composables")?;
  let mut composables = Vec::new();

  for entry in fs::read_dir(src)? {
    if matches!(entry, Ok(ref e) if e.file_type().map(|t| t.is_dir()).unwrap_or(false)) {
      if let Ok(name) = entry?.file_name().into_string() {
        composables.push(name);
      }
    }
  }

  composables.sort_unstable();

  let index = package::index("composables")?;
  let mut cts = String::with_capacity(composables.len() * 30);

  for composable in composables {
    let export_decl = format!("export * from './{composable}';\n");
    cts.push_str(export_decl.as_str());
  }

  fs::write(index, cts).map_err(Into::into)
}

/// Determines whether the composable name is valid.
pub fn is_valid<T: AsRef<str>>(name: T) -> bool {
  let regex = Regex::new(NAME_REGEX).unwrap();
  regex.is_match(name.as_ref())
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn should_determine_if_name_is_valid() {
    assert!(is_valid("useManatsu"));
    assert!(!is_valid("composable-name"));
  }
}
