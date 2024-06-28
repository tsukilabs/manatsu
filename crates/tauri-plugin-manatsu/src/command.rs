use crate::error::Result;
use crate::log::{Log, VersionSnapshot};
use tauri::{AppHandle, Runtime};

#[tauri::command]
pub async fn is_dev() -> bool {
  tauri::is_dev()
}

#[tauri::command]
pub async fn manatsu_version() -> String {
  crate::VERSION.into()
}

#[tauri::command]
pub async fn save_log<R: Runtime>(app: AppHandle<R>, log: Log) -> Result<()> {
  log.save(&app).map_err(Into::into)
}

#[tauri::command]
pub async fn version_snapshot(vue: Option<String>) -> VersionSnapshot {
  let mut snapshot = VersionSnapshot::new();
  snapshot.vue = vue;
  snapshot
}
