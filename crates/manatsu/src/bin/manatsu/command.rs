mod create;
mod theme;

use anyhow::Result;
pub use create::Create;
use std::future::Future;
pub use theme::Theme;

pub trait CliCommand {
  fn execute(self) -> impl Future<Output = Result<()>>;
}
