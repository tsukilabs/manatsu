use crate::prelude::*;
use chrono::Local;
use std::fs;

/// <https://docs.rs/chrono/latest/chrono/format/strftime/index.html>
pub const TIMESTAMP: &str = "%F %T%.3f %:z";

#[must_use]
pub fn now() -> String {
  Local::now().format(TIMESTAMP).to_string()
}

#[derive(Deserialize, Serialize)]
pub struct Version {
  pub app: Option<String>,
  manatsu: Option<String>,
  tauri: Option<String>,
  webview: Option<String>,
  vue: String,
}

impl Version {
  pub fn new<S: AsRef<str>>(vue: S) -> Self {
    Self {
      app: None,
      manatsu: Some(Self::manatsu()),
      tauri: Some(Self::tauri()),
      webview: Self::webview(),
      vue: vue.as_ref().to_owned(),
    }
  }

  #[must_use]
  pub fn manatsu() -> String {
    crate::VERSION.into()
  }

  #[must_use]
  pub fn tauri() -> String {
    tauri::VERSION.into()
  }

  #[must_use]
  pub fn webview() -> Option<String> {
    tauri::webview_version().ok()
  }
}

#[derive(Deserialize, Serialize)]
pub struct Error {
  pub name: String,
  pub message: String,
  pub stack: Option<String>,
  pub version: Version,
  pub timestamp: Option<String>,
}

pub trait Log {
  fn save<P: AsRef<Path>>(self, path: P) -> Result<()>;
}

impl Log for Error {
  fn save<P: AsRef<Path>>(mut self, path: P) -> Result<()> {
    if self.timestamp.is_none() {
      self.timestamp = Some(now());
    }

    if self.version.manatsu.is_none() {
      self.version.manatsu = Some(Version::manatsu());
    }

    if self.version.tauri.is_none() {
      self.version.tauri = Some(Version::tauri());
    }

    if self.version.webview.is_none() {
      self.version.webview = Version::webview();
    }

    let path = path.as_ref();
    let logs = fs::read(path).unwrap_or_default();
    let mut logs: Vec<Error> = serde_json::from_slice(&logs).unwrap_or_default();
    logs.push(self);

    let logs = serde_json::to_vec_pretty(&logs)?;
    fs::write(path, logs)?;

    Ok(())
  }
}
