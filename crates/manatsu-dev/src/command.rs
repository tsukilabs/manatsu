mod build;
pub mod component;
pub mod composable;
mod plugin;
mod readme;
mod release;
mod tailwind;

use crate::prelude::*;
pub use build::Build;
pub use plugin::plugin;
pub use readme::readme;
pub use release::Release;
pub use tailwind::tailwind;

pub trait Command {
  async fn execute(self) -> Result<()>;
}
