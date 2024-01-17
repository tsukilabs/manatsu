mod create;
mod dev;

use anyhow::Result;
pub use create::Create;
pub use dev::Dev;

pub trait CliCommand {
  fn execute(&self) -> Result<()>;
}
