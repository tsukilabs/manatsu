use anyhow::{anyhow, Context, Result};
use std::io::Read;
use std::time::Duration;
use ureq::Response;

#[derive(Clone, Copy)]
pub enum Template {
  Vue,
}

impl Template {
  pub fn url(&self) -> String {
    let name: &str = (*self).into();
    format!("https://github.com/manatsujs/{name}/archive/refs/heads/main.zip")
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
        .ok_or(anyhow!("Header unavailable: {}", header_name))?
        .parse()
        .with_context(|| format!("Could not parse header: {}", header_name))?;

      Ok(Vec::with_capacity(len))
    } else {
      Ok(Vec::with_capacity(100_000))
    }
  }
}

impl From<Template> for &str {
  fn from(_: Template) -> Self {
    "template-vue"
  }
}

impl<T: AsRef<str>> From<T> for Template {
  fn from(_: T) -> Self {
    Template::Vue
  }
}
