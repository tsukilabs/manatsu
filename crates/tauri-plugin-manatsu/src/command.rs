use manatsu::color::{Color, Hex, Hsl, Rgb};

/// Returns a random hex color.
#[tauri::command]
pub fn random_hex_color() -> String {
  Hex::random().into()
}

/// Returns a random HSL color.
#[tauri::command]
pub fn random_hsl_color() -> String {
  Hsl::random().into()
}

/// Returns a random RGB color.
#[tauri::command]
pub fn random_rgb_color() -> String {
  Rgb::random().into()
}
