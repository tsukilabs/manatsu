#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn footer_text() -> String {
  use chrono::Datelike;

  let current_date = chrono::Local::now();
  let year = current_date.year();
  format!("Copyright © {} Manatsu", year)
}

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_window_state::Builder::default().build())
    .plugin(tauri_plugin_manatsu::init())
    .invoke_handler(tauri::generate_handler![footer_text])
    .run(tauri::generate_context!())
    .expect("playground could not be started");
}
