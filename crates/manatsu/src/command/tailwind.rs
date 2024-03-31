use crate::prelude::*;
use bytes::Bytes;
use futures::try_join;
use reqwest::Client;
use serde_json::Value;
use walkdir::WalkDir;

#[derive(Deserialize)]
#[serde(rename_all(deserialize = "camelCase"))]
struct Prettier {
  tailwind_attributes: Vec<String>,
  tailwind_functions: Vec<String>,
}

#[derive(Deserialize)]
struct Vscode {
  #[serde(rename(deserialize = "tailwindCSS.classAttributes"))]
  class_attributes: Vec<String>,
}

pub async fn tailwind() -> Result<()> {
  let start = Instant::now();

  let client = Client::builder().brotli(true).gzip(true).build()?;

  println!("fetching Tailwind config files...");
  let prettierrc = tokio::spawn(fetch_prettierrc(client.clone()));
  let vscode_settings = tokio::spawn(fetch_vscode_settings(client.clone()));
  let (prettierrc, vscode_settings) = try_join!(prettierrc, vscode_settings)?;

  let prettierrc: Prettier = serde_json::from_slice(&prettierrc?)?;
  let vscode_settings: Vscode = serde_json::from_slice(&vscode_settings?)?;

  let globset = GlobSetBuilder::new()
    .add(Glob::new("**/.prettierrc.json")?)
    .add(Glob::new("**/.vscode/settings.json")?)
    .build()?;

  let files = WalkDir::new(".")
    .into_iter()
    .filter_map(std::result::Result::ok)
    .filter(|e| globset.is_match(e.path()))
    .collect_vec();

  if files.is_empty() {
    bail!("no Tailwind config files found".red());
  }

  for file in files {
    let path = file.path();
    let content = fs::read_to_string(path)?;
    let mut value: Value = serde_json::from_str(&content)?;

    if let Some(attributes) = value.get_mut("tailwindAttributes") {
      *attributes = serde_json::to_value(&prettierrc.tailwind_attributes)?;
    }

    if let Some(functions) = value.get_mut("tailwindFunctions") {
      *functions = serde_json::to_value(&prettierrc.tailwind_functions)?;
    }

    if let Some(class_attributes) = value.get_mut("tailwindCSS.classAttributes") {
      *class_attributes = serde_json::to_value(&vscode_settings.class_attributes)?;
    }

    let contents = serde_json::to_string_pretty(&value)?;
    fs::write(path, contents)?;
  }

  let message = format!("done in {:?}", start.elapsed());
  println!("{}", message.bright_green());

  Ok(())
}

async fn fetch(client: Client, url: &str) -> Result<Bytes> {
  client
    .get(url)
    .timeout(Duration::from_secs(10))
    .send()
    .await
    .with_context(|| format!("could not fetch: {url}"))?
    .bytes()
    .await
    .map_err(Into::into)
}

async fn fetch_prettierrc(client: Client) -> Result<Bytes> {
  let url = "https://raw.githubusercontent.com/tsukilabs/manatsu/main/.prettierrc.json";
  fetch(client, url).await
}

async fn fetch_vscode_settings(client: Client) -> Result<Bytes> {
  let url = "https://raw.githubusercontent.com/tsukilabs/manatsu/main/.vscode/settings.json";
  fetch(client, url).await
}
