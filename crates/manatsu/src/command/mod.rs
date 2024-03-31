mod create;
mod theme;

use crate::prelude::*;
pub use create::Create;
pub use theme::Theme;

pub trait Command {
  async fn execute(self) -> Result<()>;
}
