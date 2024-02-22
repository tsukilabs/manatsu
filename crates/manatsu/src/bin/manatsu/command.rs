mod create;
mod theme;

use anyhow::Result;
pub use create::Create;
pub use theme::Theme;
use std::future::Future;

pub trait CliCommand {
  fn execute(self) -> impl Future<Output = Result<()>>;
}
