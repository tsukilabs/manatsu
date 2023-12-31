use tauri::plugin::{Builder, TauriPlugin};
use tauri::Runtime;

#[tauri::command]
fn hello() {
  println!("Hello, Manatsu!");
}

pub fn init<R: Runtime>() -> TauriPlugin<R> {
  Builder::new("manatsu")
    .invoke_handler(tauri::generate_handler![hello])
    .build()
}
