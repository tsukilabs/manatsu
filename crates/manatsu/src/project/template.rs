use crate::prelude::*;
use bytes::Bytes;
use reqwest::Client;
use strum::{Display, EnumString};

#[derive(Display, EnumString)]
#[strum(serialize_all = "kebab-case")]
pub enum Template {
  Tauri,
  Vue,
}

impl Template {
  #[must_use]
  pub fn url(&self) -> String {
    let name = self.to_string();
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
      .with_context(|| format!("could not fetch: {template_url}"))?;

    response.bytes().await.map_err(Into::into)
  }
}
