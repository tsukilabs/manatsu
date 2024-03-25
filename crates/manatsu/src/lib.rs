pub mod color;
pub mod log;
mod macros;
pub(crate) mod prelude;
pub mod project;
pub mod theme;

pub const VERSION: &str = env!("CARGO_PKG_VERSION");
