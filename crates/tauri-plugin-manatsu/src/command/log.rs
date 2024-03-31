use crate::log::{self, Log};
use crate::prelude::*;

#[tauri::command]
pub async fn error_log_path<R: Runtime>(app: AppHandle<R>) -> Result<PathBuf> {
  log::Error::path(&app).map_err(Into::into)
}

#[tauri::command]
pub async fn read_error_logs<R: Runtime>(app: AppHandle<R>) -> Result<Vec<log::Error>> {
  log::Error::read(&app).await.map_err(Into::into)
}

#[tauri::command]
pub async fn save_error_log<R: Runtime>(app: AppHandle<R>, log: log::Error) -> Result<()> {
  log.save(&app).await.map_err(Into::into)
}
