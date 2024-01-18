mod create;
mod dev;
mod theme;

use anyhow::Result;
pub use create::Create;
pub use dev::Dev;
pub use theme::Theme;

pub trait CliCommand {
  fn execute(&self) -> Result<()>;
}
