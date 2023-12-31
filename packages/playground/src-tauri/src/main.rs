#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_manatsu::init())
    .run(tauri::generate_context!())
    .expect("Playground could not be started");
}
