#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod error;

use anyhow::anyhow;
use error::Result;

#[tauri::command]
async fn copyright() -> String {
  use chrono::Datelike;

  let year = chrono::Local::now().year();
  format!("Copyright © {year} Manatsu")
}

#[tauri::command]
async fn unhandled_error() -> Result<()> {
  Err(anyhow!("This is an unhandled error")).map_err(Into::into)
}

#[tokio::main]
async fn main() {
  tauri::Builder::default()
    .plugin(tauri_plugin_window_state::Builder::default().build())
    .plugin(tauri_plugin_manatsu::init())
    .invoke_handler(tauri::generate_handler![copyright, unhandled_error])
    .run(tauri::generate_context!())
    .expect("playground could not be started");
}
