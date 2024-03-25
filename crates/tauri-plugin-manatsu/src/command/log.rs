use crate::prelude::*;
use manatsu::log::{self, Log};

#[tauri::command]
pub async fn error_log_path<R: Runtime>(app: AppHandle<R>) -> Result<PathBuf> {
  log::Error::path(&app).map_err(Into::into)
}

#[tauri::command]
pub async fn read_error_logs<R: Runtime>(app: AppHandle<R>) -> Result<Vec<log::Error>> {
  log::Error::read(&app).map_err(Into::into)
}

#[tauri::command]
pub async fn save_error_log<R: Runtime>(app: AppHandle<R>, log: log::Error) -> Result<()> {
  log.save(&app).map_err(Into::into)
}
