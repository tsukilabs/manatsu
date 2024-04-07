#![allow(clippy::missing_errors_doc)]
#![allow(clippy::module_name_repetitions)]
#![allow(clippy::must_use_candidate)]

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
      command::error_log_path,
      command::is_dev,
      command::manatsu_version,
      command::read_error_logs,
      command::save_error_log,
      command::version_snapshot,
    ])
    .build()
}
