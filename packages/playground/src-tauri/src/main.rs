#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

#[tauri::command]
fn footer_text() -> String {
  String::from("Copyright © 2024 Manatsu")
}

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_manatsu::init())
    .invoke_handler(tauri::generate_handler![footer_text])
    .run(tauri::generate_context!())
    .expect("Playground could not be started");
}
