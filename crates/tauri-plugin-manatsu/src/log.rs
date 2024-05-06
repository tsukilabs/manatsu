use crate::prelude::*;
use chrono::{DateTime, FixedOffset};
use sysinfo::System;

pub mod date {
  use chrono::Local;

  /// <https://docs.rs/chrono/latest/chrono/format/strftime/index.html>
  pub const TIMESTAMP: &str = "%F %T%.3f %:z";

  pub fn now() -> String {
    Local::now().format(TIMESTAMP).to_string()
  }
}

#[derive(Deserialize, Serialize, PartialEq, Eq)]
pub struct VersionSnapshot {
  pub app: Option<String>,
  manatsu: Option<String>,
  os: Option<String>,
  tauri: Option<String>,
  webview: Option<String>,
  vue: String,
}

impl VersionSnapshot {
  pub fn new(vue: impl AsRef<str>) -> Self {
    Self {
      app: None,
      manatsu: Some(Self::manatsu()),
      tauri: Some(Self::tauri()),
      os: System::long_os_version(),
      webview: Self::webview(),
      vue: vue.as_ref().to_owned(),
    }
  }

  pub fn manatsu() -> String {
    crate::VERSION.into()
  }

  pub fn tauri() -> String {
    tauri::VERSION.into()
  }

  pub fn webview() -> Option<String> {
    tauri::webview_version().ok()
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
  pub fn path<R: Runtime>(app: &AppHandle<R>) -> Result<PathBuf> {
    app
      .path()
      .app_log_dir()
      .map(|path| path.join("error.json"))
      .map_err(Into::into)
  }

  pub async fn read<R: Runtime>(app: &AppHandle<R>) -> Result<Vec<Self>> {
    let path = Self::path(app)?;
    let logs = fs::read(path).await.unwrap_or_default();

    let mut logs: Vec<Self> = serde_json::from_slice(&logs)?;
    logs.sort_unstable_by(|a, b| b.cmp(a));

    Ok(logs)
  }

  pub async fn save<R: Runtime>(mut self, app: &AppHandle<R>) -> Result<()> {
    if self.timestamp.is_none() {
      self.timestamp = Some(date::now());
    }

    if self.version.manatsu.is_none() {
      self.version.manatsu = Some(VersionSnapshot::manatsu());
    }

    if self.version.os.is_none() {
      self.version.os = System::long_os_version();
    }

    if self.version.tauri.is_none() {
      self.version.tauri = Some(VersionSnapshot::tauri());
    }

    if self.version.webview.is_none() {
      self.version.webview = VersionSnapshot::webview();
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
