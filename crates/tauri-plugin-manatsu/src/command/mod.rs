pub mod log;

use crate::log::VersionSnapshot;

#[tauri::command]
pub async fn manatsu_version() -> String {
  crate::VERSION.into()
}

#[tauri::command]
pub async fn version_snapshot(vue: String) -> VersionSnapshot {
  VersionSnapshot::new(vue)
}
