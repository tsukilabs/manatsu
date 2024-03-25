use crate::prelude::*;
use chrono::{DateTime, FixedOffset};
use std::cmp::Ordering;
use std::fs;
use tauri::{AppHandle, Manager, Runtime};

pub mod date {
  use chrono::Local;

  /// <https://docs.rs/chrono/latest/chrono/format/strftime/index.html>
  pub const TIMESTAMP: &str = "%F %T%.3f %:z";

  #[must_use]
  pub fn now() -> String {
    Local::now().format(TIMESTAMP).to_string()
  }
}

#[derive(Deserialize, Serialize, PartialEq, Eq)]
pub struct VersionSnapshot {
  pub app: Option<String>,
  manatsu: Option<String>,
  tauri: Option<String>,
  webview: Option<String>,
  vue: String,
}

impl VersionSnapshot {
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

#[derive(Deserialize, Serialize, PartialEq, Eq)]
pub struct Error {
  pub name: String,
  pub message: String,
  pub stack: Option<String>,
  pub version: VersionSnapshot,
  pub timestamp: Option<String>,
}

impl Error {
  fn datetime_or_default(&self) -> DateTime<FixedOffset> {
    if let Some(timestamp) = &self.timestamp {
      DateTime::parse_from_str(timestamp, date::TIMESTAMP).unwrap_or_default()
    } else {
      DateTime::default()
    }
  }
}

impl PartialOrd for Error {
  fn partial_cmp(&self, other: &Self) -> Option<Ordering> {
    Some(self.cmp(other))
  }
}

impl Ord for Error {
  fn cmp(&self, other: &Self) -> Ordering {
    match self.datetime_or_default().cmp(&other.datetime_or_default()) {
      Ordering::Equal => self.name.cmp(&other.name),
      ordering => ordering,
    }
  }
}

pub trait Log {
  fn path<R: Runtime>(app: &AppHandle<R>) -> Result<PathBuf> {
    let path = app.path().app_log_dir()?.join("error.json");
    Ok(path)
  }

  fn read<R: Runtime>(app: &AppHandle<R>) -> Result<Vec<Self>>
  where
    Self: for<'de> Deserialize<'de>;

  fn save<R: Runtime>(self, app: &AppHandle<R>) -> Result<()>;
}

impl Log for Error {
  fn read<R: Runtime>(app: &AppHandle<R>) -> Result<Vec<Self>>
  where
    Self: for<'de> Deserialize<'de>,
  {
    let path = Self::path(app)?;
    let logs = fs::read(path).unwrap_or_default();

    let mut logs: Vec<Self> = serde_json::from_slice(&logs)?;
    logs.sort_unstable_by(|a, b| b.cmp(a));

    Ok(logs)
  }

  fn save<R>(mut self, app: &AppHandle<R>) -> Result<()>
  where
    R: Runtime,
  {
    if self.timestamp.is_none() {
      self.timestamp = Some(date::now());
    }

    if self.version.manatsu.is_none() {
      self.version.manatsu = Some(VersionSnapshot::manatsu());
    }

    if self.version.tauri.is_none() {
      self.version.tauri = Some(VersionSnapshot::tauri());
    }

    if self.version.webview.is_none() {
      self.version.webview = VersionSnapshot::webview();
    }

    self.version.app = app.config().version.clone();

    let path = Self::path(app)?;
    let log_dir = path.parent().unwrap();

    match log_dir.try_exists() {
      Ok(true) => {}
      Ok(false) => fs::create_dir_all(log_dir)?,
      Err(e) => return Err(e.into()),
    }

    let logs = fs::read(&path).unwrap_or_default();
    let mut logs: Vec<Error> = serde_json::from_slice(&logs).unwrap_or_default();
    logs.push(self);

    let logs = serde_json::to_vec_pretty(&logs)?;
    fs::write(path, logs)?;

    Ok(())
  }
}
