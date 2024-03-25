use crate::prelude::*;
use manatsu::log::{self, Log};

#[tauri::command]
pub async fn log_error<R: Runtime>(app: AppHandle<R>, mut log: log::Error) -> Result<()> {
  let log_dir = app.path().app_log_dir()?;
  match log_dir.try_exists() {
    Ok(true) => {}
    Ok(false) => fs::create_dir_all(&log_dir)?,
    Err(e) => return Err(e.into()),
  }

  log.version.app = app.config().version.clone();

  let path = log_dir.join("error.json");
  log.save(path).map_err(Into::into)
}
