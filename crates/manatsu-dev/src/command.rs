mod build;
pub mod component;
pub mod composable;
mod readme;
mod release;

use anyhow::Result;
pub use build::Build;
pub use readme::readme;
pub use release::Release;

pub trait Command {
  async fn execute(self) -> Result<()>;
}
