mod build;
pub mod component;
pub mod composable;
mod readme;
mod release;
mod tailwind;

use anyhow::Result;
pub use build::Build;
pub use readme::readme;
pub use release::Release;
pub use tailwind::tailwind;

pub trait Command {
  async fn execute(self) -> Result<()>;
}
