use crate::log::{Log, VersionSnapshot};
use crate::prelude::*;

#[tauri::command]
pub async fn is_dev() -> bool {
  tauri::dev()
}

#[tauri::command]
pub async fn log_path<R: Runtime>(app: AppHandle<R>) -> Result<PathBuf> {
  Log::path(&app).map_err(Into::into)
}

#[tauri::command]
pub async fn manatsu_version() -> String {
  crate::VERSION.into()
}

#[tauri::command]
pub async fn read_logs<R: Runtime>(app: AppHandle<R>) -> Result<Vec<Log>> {
  Log::read(&app).await.map_err(Into::into)
}

#[tauri::command]
pub async fn save_log<R: Runtime>(app: AppHandle<R>, log: Log) -> Result<()> {
  log.save(&app).await.map_err(Into::into)
}

#[tauri::command]
pub async fn version_snapshot(vue: String) -> VersionSnapshot {
  VersionSnapshot::new(vue)
}
