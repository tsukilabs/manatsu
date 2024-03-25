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
use std::future::Future;
pub use tailwind::tailwind;

pub trait Command {
  fn execute(self) -> impl Future<Output = Result<()>> + Send;
}
