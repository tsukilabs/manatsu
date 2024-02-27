use anyhow::{bail, Context, Result};
use bytes::Bytes;
use convert_case::{Case, Casing};
use reqwest::Client;
use std::fmt;
use std::time::Duration;

#[derive(Clone, Copy)]
pub enum Template {
  Tauri,
  Vue,
}

impl Template {
  pub fn url(&self) -> String {
    let name: &str = (*self).into();
    format!("https://github.com/tsukilabs/manatsu-template-{name}/archive/refs/heads/main.zip")
  }

  /// Download a Manatsu template as bytes.
  pub async fn download(&self) -> Result<Bytes> {
    let client = Client::builder().gzip(true).build()?;
    let template_url = self.url();

    let response = client
      .get(&template_url)
      .timeout(Duration::from_secs(10))
      .send()
      .await
      .with_context(|| format!("could not fetch: {}", template_url))?;

    let bytes = response.bytes().await?;

    Ok(bytes)
  }
}

impl From<Template> for &str {
  fn from(template: Template) -> Self {
    match template {
      Template::Tauri => "tauri",
      Template::Vue => "vue",
    }
  }
}

impl TryFrom<&str> for Template {
  type Error = anyhow::Error;

  fn try_from(value: &str) -> Result<Self> {
    let value = value.trim().to_lowercase();
    let template = match value.as_str() {
      "tauri" => Template::Tauri,
      "vue" => Template::Vue,
      _ => bail!(format!("{value} is not a valid template name")),
    };

    Ok(template)
  }
}

impl fmt::Display for Template {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    let name: &str = (*self).into();
    let name = name.to_case(Case::Title);
    write!(f, "{name}")
  }
}
