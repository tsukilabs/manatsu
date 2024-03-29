mod hex;
mod hsl;
mod rgb;

pub use hex::Hex;
pub use hsl::Hsl;
pub use rgb::Rgb;
use serde::Serialize;
use std::fmt;

pub trait Color: Clone + fmt::Display + Serialize {
  fn random() -> Self;
  fn random_with_alpha() -> Self;
}
