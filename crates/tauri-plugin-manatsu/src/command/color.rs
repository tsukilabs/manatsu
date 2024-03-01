use crate::error::Error;
use crate::Result;
use manatsu::color::{Color, Hex, Hsl, Rgb};

#[tauri::command]
pub fn string_to_hex(value: String) -> Result<Hex> {
  Hex::try_from(value.as_str()).map_err(|e| Error::Color(e.to_string()))
}

#[tauri::command]
pub fn hex_to_rgb(hex: Hex) -> Rgb {
  hex.into()
}

#[tauri::command]
pub fn hex_to_hsl(hex: Hex) -> Hsl {
  hex.into()
}

#[tauri::command]
pub fn hex_to_string(hex: Hex) -> String {
  hex.into()
}

#[tauri::command]
pub fn rgb_to_hex(rgb: Rgb) -> Hex {
  rgb.into()
}

#[tauri::command]
pub fn rgb_to_hsl(rgb: Rgb) -> Hsl {
  rgb.into()
}

#[tauri::command]
pub fn rgb_to_string(rgb: Rgb) -> String {
  rgb.into()
}

#[tauri::command]
pub fn hsl_to_hex(hsl: Hsl) -> Hex {
  hsl.into()
}

#[tauri::command]
pub fn hsl_to_rgb(hsl: Hsl) -> Rgb {
  hsl.into()
}

#[tauri::command]
pub fn hsl_to_string(hsl: Hsl) -> String {
  hsl.into()
}

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
