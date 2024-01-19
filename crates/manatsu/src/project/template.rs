use anyhow::{anyhow, bail, Context, Result};
use convert_case::{Case, Casing};
use std::fmt;
use std::io::Read;
use std::time::Duration;
use ureq::Response;

#[derive(Clone, Copy)]
pub enum Template {
  Tauri,
  Vue,
}

impl Template {
  pub fn url(&self) -> String {
    let name: &str = (*self).into();
    format!("https://github.com/tsukilabs/{name}/archive/refs/heads/main.zip")
  }

  /// Download a Manatsu template as bytes.
  pub fn download(&self) -> Result<Vec<u8>> {
    let template_url = self.url();
    let response = ureq::get(&template_url)
      .timeout(Duration::from_secs(10))
      .call()
      .with_context(|| format!("Could not fetch: {}", template_url))?;

    let mut bytes = self.create_bytes_vec(&response)?;
    response
      .into_reader()
      .take(10_000_000)
      .read_to_end(&mut bytes)?;

    Ok(bytes)
  }

  fn create_bytes_vec(&self, response: &Response) -> Result<Vec<u8>> {
    let header_name = "content-length";
    if response.has(header_name) {
      let len: usize = response
        .header(header_name)
        .ok_or_else(|| anyhow!("Header unavailable: {}", header_name))?
        .parse()
        .with_context(|| format!("Could not parse header: {}", header_name))?;

      Ok(Vec::with_capacity(len))
    } else {
      Ok(Vec::with_capacity(100_000))
    }
  }
}

impl From<Template> for &str {
  fn from(template: Template) -> Self {
    match template {
      Template::Tauri => "template-tauri",
      Template::Vue => "template-vue",
    }
  }
}

impl TryFrom<&str> for Template {
  type Error = anyhow::Error;

  fn try_from(value: &str) -> Result<Self> {
    let value = value.trim().to_lowercase();
    let template = match value.as_str() {
      "template-tauri" => Template::Tauri,
      "template-vue" => Template::Vue,
      _ => bail!(format!("{value} is not a valid template name")),
    };

    Ok(template)
  }
}

impl fmt::Display for Template {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    let name: &str = (*self).into();
    let name = name.replace("template-", "");
    let name = name.to_case(Case::Title);
    write!(f, "{name}")
  }
}
