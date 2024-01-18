mod command;

use command::*;
use tauri::plugin::{Builder, TauriPlugin};
use tauri::Runtime;

pub fn init<R: Runtime>() -> TauriPlugin<R> {
  Builder::new("manatsu")
    .invoke_handler(tauri::generate_handler![
      random_hex_color,
      random_hsl_color,
      random_rgb_color
    ])
    .build()
}
