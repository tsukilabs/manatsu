mod create;
mod tailwind;
mod theme;

use crate::prelude::*;
pub use create::Create;
pub use tailwind::tailwind;
pub use theme::Theme;

pub trait Command {
  async fn execute(self) -> Result<()>;
}
