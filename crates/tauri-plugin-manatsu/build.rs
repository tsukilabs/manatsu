const COMMANDS: &[&str] = &[
  "is_dev",
  "log_path",
  "manatsu_version",
  "read_logs",
  "save_log",
  "version_snapshot",
];

fn main() {
  tauri_plugin::Builder::new(COMMANDS).build();
}
