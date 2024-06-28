mod command;
mod error;
mod log;

pub use error::Error;
pub use log::{date, Log, VersionSnapshot};

use log::LogCache;
use tauri::plugin::{Builder, TauriPlugin};
use tauri::{Manager, RunEvent, Runtime};

pub const VERSION: &str = env!("CARGO_PKG_VERSION");

pub fn init<R: Runtime>() -> TauriPlugin<R> {
  Builder::new("manatsu")
    .invoke_handler(tauri::generate_handler![
      command::is_dev,
      command::manatsu_version,
      command::save_log,
      command::version_snapshot,
    ])
    .setup(|app, _api| {
      app.manage(LogCache(Default::default()));
      Ok(())
    })
    .on_event(move |app, event| {
      if let RunEvent::Exit = event {
        let _ = Log::write_to_disk(app);
      }
    })
    .build()
}
