const COMMANDS: &[&str] = &[
  "error_log_path",
  "hex_to_hsl",
  "hex_to_rgb",
  "hex_to_string",
  "hsl_to_hex",
  "hsl_to_rgb",
  "hsl_to_string",
  "manatsu_version",
  "random_hex_color",
  "random_hsl_color",
  "random_rgb_color",
  "random_string_hex_color",
  "random_string_hsl_color",
  "random_string_rgb_color",
  "read_error_logs",
  "rgb_to_hex",
  "rgb_to_hsl",
  "rgb_to_string",
  "save_error_log",
  "string_to_hex",
  "version_snapshot",
];

fn main() {
  tauri_plugin::Builder::new(COMMANDS).build();
}
