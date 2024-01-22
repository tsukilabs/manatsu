mod create;
mod theme;

use anyhow::Result;
pub use create::Create;
pub use theme::Theme;

pub trait CliCommand {
  fn execute(&self) -> Result<()>;
}
