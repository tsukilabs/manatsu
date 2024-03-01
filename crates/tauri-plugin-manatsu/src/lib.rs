mod command;
mod error;

use tauri::plugin::{Builder, TauriPlugin};
use tauri::Runtime;

type Result<T> = std::result::Result<T, error::Error>;

pub fn init<R: Runtime>() -> TauriPlugin<R> {
  Builder::new("manatsu")
    .invoke_handler(tauri::generate_handler![
      command::hex_to_hsl,
      command::hex_to_rgb,
      command::hex_to_string,
      command::hsl_to_hex,
      command::hsl_to_rgb,
      command::hsl_to_string,
      command::random_hex_color,
      command::random_hsl_color,
      command::random_rgb_color,
      command::rgb_to_hex,
      command::rgb_to_hsl,
      command::rgb_to_string,
      command::string_to_hex,
    ])
    .build()
}
