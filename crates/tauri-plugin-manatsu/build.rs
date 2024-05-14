const COMMANDS: &[&str] = &["is_dev", "manatsu_version", "save_log", "version_snapshot"];

fn main() {
  tauri_plugin::Builder::new(COMMANDS).build();
}
