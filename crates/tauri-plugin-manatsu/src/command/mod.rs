pub mod color;
pub mod log;

#[tauri::command]
pub async fn manatsu_version() -> String {
  manatsu::VERSION.into()
}
