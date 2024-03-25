pub mod color;
pub mod log;

/// Get the current version of Manatsu.
#[tauri::command]
pub async fn version() -> String {
  manatsu::VERSION.into()
}
