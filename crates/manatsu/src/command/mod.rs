mod create;
mod theme;
mod tailwind;

use crate::prelude::*;
pub use create::Create;
pub use theme::Theme;
pub use tailwind::tailwind;

pub trait Command {
  async fn execute(self) -> Result<()>;
}
