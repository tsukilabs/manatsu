const COMMANDS: &[&str] = &[
  "error_log_path",
  "manatsu_version",
  "read_error_logs",
  "save_error_log",
  "version_snapshot",
];

fn main() {
  tauri_plugin::Builder::new(COMMANDS).build();
}
