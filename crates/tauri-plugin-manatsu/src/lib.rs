mod command;

use tauri::plugin::{Builder, TauriPlugin};
use tauri::Runtime;

pub fn init<R: Runtime>() -> TauriPlugin<R> {
  Builder::new("manatsu")
    .invoke_handler(tauri::generate_handler![
      command::random_hex_color,
      command::random_hsl_color,
      command::random_rgb_color
    ])
    .build()
}
