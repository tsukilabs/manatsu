mod command;
mod error;
mod log;
mod prelude;

pub use error::Error;
pub use log::{date, Log, VersionSnapshot};

use tauri::plugin::{Builder, TauriPlugin};
use tauri::Runtime;

pub const VERSION: &str = env!("CARGO_PKG_VERSION");

pub fn init<R: Runtime>() -> TauriPlugin<R> {
  Builder::new("manatsu")
    .invoke_handler(tauri::generate_handler![
      command::is_dev,
      command::manatsu_version,
      command::save_log,
      command::version_snapshot,
    ])
    .build()
}
