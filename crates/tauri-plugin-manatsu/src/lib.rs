mod command;
pub mod error;
pub mod log;
pub(crate) mod prelude;

use tauri::plugin::{Builder, TauriPlugin};
use tauri::Runtime;

pub const VERSION: &str = env!("CARGO_PKG_VERSION");

pub fn init<R: Runtime>() -> TauriPlugin<R> {
  Builder::new("manatsu")
    .invoke_handler(tauri::generate_handler![
      command::log_path,
      command::is_dev,
      command::manatsu_version,
      command::read_logs,
      command::save_log,
      command::version_snapshot,
    ])
    .build()
}
