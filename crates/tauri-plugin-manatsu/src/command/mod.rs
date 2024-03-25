pub mod color;
pub mod log;

use manatsu::log::VersionSnapshot;

#[tauri::command]
pub async fn manatsu_version() -> String {
  manatsu::VERSION.into()
}

#[tauri::command]
pub async fn version_snapshot(vue: String) -> VersionSnapshot {
  VersionSnapshot::new(vue)
}
