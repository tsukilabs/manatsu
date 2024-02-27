use manatsu::color::{Color, Hex, Hsl, Rgb};

/// Generate a random hex color.
#[tauri::command]
pub fn random_hex_color() -> String {
  Hex::random().into()
}

/// Generate a random HSL color.
#[tauri::command]
pub fn random_hsl_color() -> String {
  Hsl::random().into()
}

/// Generate a random RGB color.
#[tauri::command]
pub fn random_rgb_color() -> String {
  Rgb::random().into()
}
