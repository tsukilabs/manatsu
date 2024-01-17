mod create;
mod dev;

use anyhow::Result;
pub use create::CreateCommand;
pub use dev::DevCommand;

pub trait ManatsuCommand {
  fn execute(&self) -> Result<()>;
}
