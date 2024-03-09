use crate::prelude::*;
use std::collections::HashSet;
use walkdir::WalkDir;

// https://regex101.com/r/mdP6Q7
const CLASS_REGEX: &str = r#":class="(?:.*\.)?([a-zA-Z]+Class)""#;

/// Collect all non-standard class attributes used by Manatsu.
pub fn tailwind() -> Result<()> {
  let start = Instant::now();

  let dir = package::src("components")?;
  let glob = Glob::new("*.vue")?.compile_matcher();
  let files = WalkDir::new(dir)
    .into_iter()
    .filter_map(std::result::Result::ok)
    .filter(|e| glob.is_match(e.path()));

  let regex = Regex::new(CLASS_REGEX)?;

  let mut classes = HashSet::new();
  println!("{}", "collecting class attributes...".bright_cyan());

  for file in files {
    let content = fs::read_to_string(file.path())?;
    let captures = regex.captures_iter(&content).map(|c| c.extract().1);

    for [class] in captures {
      classes.insert(class.to_owned());
    }
  }

  let classes = {
    let mut classes: Vec<String> = classes
      .into_iter()
      .map(|c| c.to_case(Case::Kebab))
      .collect();

    classes.sort_unstable();
    classes
  };

  println!("{}", "writing class attributes...".bright_cyan());

  let prettier = env::current_dir()?.join(".prettierrc.json");
  if let Ok(true) = prettier.try_exists() {
    let content = fs::read_to_string(&prettier)?;
    let mut value = serde_json::from_str::<serde_json::Value>(&content)?;
    value["tailwindAttributes"] = serde_json::to_value(&classes)?;

    let content = serde_json::to_string_pretty(&value)?;
    fs::write(prettier, content)?;
  }

  let vscode = env::current_dir()?.join(".vscode/settings.json");
  if let Ok(true) = vscode.try_exists() {
    let content = fs::read_to_string(&vscode)?;
    let mut value: serde_json::Value = serde_json::from_str(&content)?;
    value["tailwindCSS.classAttributes"] = serde_json::to_value(classes)?;

    let content = serde_json::to_string_pretty(&value)?;
    fs::write(vscode, content)?;
  }

  let message = format!("done in {:?}", start.elapsed());
  println!("{}", message.bright_green());

  Ok(())
}
