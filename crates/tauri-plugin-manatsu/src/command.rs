use crate::log::{Log, VersionSnapshot};
use crate::prelude::*;

#[tauri::command]
pub async fn is_dev() -> bool {
  tauri::dev()
}

#[tauri::command]
pub async fn manatsu_version() -> String {
  crate::VERSION.into()
}

#[tauri::command]
pub async fn save_log<R: Runtime>(app: AppHandle<R>, log: Log) -> Result<()> {
  log.save(&app).await.map_err(Into::into)
}

#[tauri::command]
pub async fn version_snapshot(vue: Option<String>) -> VersionSnapshot {
  let mut snapshot = VersionSnapshot::new();
  snapshot.vue = vue;
  snapshot
}
