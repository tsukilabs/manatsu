use crate::prelude::*;
use chrono::{DateTime, FixedOffset, Local};
use std::sync::OnceLock;
use sysinfo::System;

static VUE_VERSION: OnceLock<String> = OnceLock::new();

pub mod date {
  use chrono::Local;

  /// <https://docs.rs/chrono/latest/chrono/format/strftime/index.html>
  pub const TIMESTAMP: &str = "%F %T%.3f %:z";

  pub fn now() -> String {
    Local::now().format(TIMESTAMP).to_string()
  }
}

#[derive(Default, Deserialize, Serialize, PartialEq, Eq)]
pub struct VersionSnapshot {
  pub app: Option<String>,
  pub manatsu: Option<String>,
  pub os: Option<String>,
  pub tauri: Option<String>,
  pub webview: Option<String>,
  pub vue: Option<String>,
}

impl VersionSnapshot {
  pub fn new() -> Self {
    Self {
      app: None,
      manatsu: Some(Self::manatsu()),
      tauri: Some(Self::tauri()),
      os: System::long_os_version(),
      webview: Self::webview(),
      vue: Self::vue(),
    }
  }

  pub fn manatsu() -> String {
    crate::VERSION.into()
  }

  pub fn os() -> Option<String> {
    System::long_os_version()
  }

  pub fn tauri() -> String {
    tauri::VERSION.into()
  }

  pub fn webview() -> Option<String> {
    tauri::webview_version().ok()
  }

  pub fn vue() -> Option<String> {
    VUE_VERSION.get().cloned()
  }
}

#[derive(Deserialize, Serialize, PartialEq, Eq)]
pub struct Log {
  pub name: String,
  pub message: String,
  pub stack: Option<String>,
  pub version: VersionSnapshot,
  pub timestamp: Option<String>,
}

impl Log {
  pub fn new(name: impl Into<String>, message: impl Into<String>) -> Self {
    Self {
      name: name.into(),
      message: message.into(),
      stack: None,
      version: VersionSnapshot::new(),
      timestamp: date::now().into(),
    }
  }

  fn path<R: Runtime>(app: &AppHandle<R>) -> Result<PathBuf> {
    let date = Local::now().format("%Y%m%d");
    let filename = format!("error.{date}.json");
    app
      .path()
      .app_log_dir()
      .map(|path| path.join(filename))
      .map_err(Into::into)
  }

  pub async fn save<R: Runtime>(mut self, app: &AppHandle<R>) -> Result<()> {
    if self.timestamp.is_none() {
      self.timestamp = date::now().into();
    }

    if self.version.manatsu.is_none() {
      self.version.manatsu = VersionSnapshot::manatsu().into();
    }

    if self.version.os.is_none() {
      self.version.os = VersionSnapshot::os();
    }

    if self.version.tauri.is_none() {
      self.version.tauri = VersionSnapshot::tauri().into();
    }

    if self.version.webview.is_none() {
      self.version.webview = VersionSnapshot::webview();
    }

    if let Some(vue) = self.version.vue.as_ref() {
      let _ = VUE_VERSION.set(vue.to_owned());
    } else {
      self.version.vue = VersionSnapshot::vue();
    }

    app.config().version.clone_into(&mut self.version.app);

    let path = Self::path(app)?;
    if let Some(parent) = path.parent() {
      fs::create_dir_all(parent).await?;
    }

    error!(name = %self.name, message = %self.message);

    let logs = fs::read(&path).await.unwrap_or_default();
    let mut logs: Vec<Log> = serde_json::from_slice(&logs).unwrap_or_default();

    logs.push(self);
    logs.sort_unstable_by(|a, b| b.cmp(a));

    let logs = serde_json::to_vec_pretty(&logs)?;
    fs::write(path, logs).await.map_err(Into::into)
  }

  fn datetime_or_default(&self) -> DateTime<FixedOffset> {
    self
      .timestamp
      .as_ref()
      .and_then(|it| DateTime::parse_from_str(it, date::TIMESTAMP).ok())
      .unwrap_or_default()
  }
}

impl PartialOrd for Log {
  fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
    Some(self.cmp(other))
  }
}

impl Ord for Log {
  fn cmp(&self, other: &Self) -> Ordering {
    match self.datetime_or_default().cmp(&other.datetime_or_default()) {
      Ordering::Equal => self.name.cmp(&other.name),
      ordering => ordering,
    }
  }
}
