mod build;
mod plugin;
mod readme;
mod release;

use crate::prelude::*;
pub use build::Build;
pub use plugin::plugin;
pub use readme::readme;
pub use release::Release;

pub trait Command {
  async fn execute(self) -> Result<()>;
}
