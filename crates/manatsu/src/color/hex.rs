use super::hsl::Hsl;
use super::rgb::Rgb;
use super::Color;
use crate::prelude::*;
use std::fmt;

/// <https://regex101.com/r/OKsEXy>
const HEX_REGEX: &str = r"#?([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})([0-9a-fA-F]{2})?";

/// Represents a hex color.
#[derive(Clone, Deserialize, Serialize)]
pub struct Hex {
  pub r: u8,
  pub g: u8,
  pub b: u8,
  pub a: Option<f64>,
}

impl Color for Hex {
  /// Generate a random hex color.
  fn random() -> Self {
    Rgb::random().into()
  }

  /// Generate a random hex color with an alpha value.
  fn random_with_alpha() -> Self {
    Rgb::random_with_alpha().into()
  }
}

impl From<Rgb> for Hex {
  fn from(rgb: Rgb) -> Self {
    Self {
      r: rgb.r,
      g: rgb.g,
      b: rgb.b,
      a: rgb.a,
    }
  }
}

impl From<Hsl> for Hex {
  fn from(hsl: Hsl) -> Self {
    Self::from(Rgb::from(hsl))
  }
}

impl TryFrom<&str> for Hex {
  type Error = anyhow::Error;

  fn try_from(value: &str) -> Result<Self, Self::Error> {
    let value = value.trim();
    let err = || anyhow!("{value} is not a valid hex color");

    let hex_regex = Regex::new(HEX_REGEX).expect("hardcoded regex should be valid");
    let caps = hex_regex.captures(value).ok_or_else(err)?;

    macro_rules! to_u8 {
      ($index:literal) => {{
        caps
          .get($index)
          .map(|m| u8::from_str_radix(m.as_str(), 16).ok())
          .flatten()
          .ok_or_else(err)
      }};
    }

    let r = to_u8!(1)?;
    let g = to_u8!(2)?;
    let b = to_u8!(3)?;
    let a = to_u8!(4).ok().map(|a| f64::from(a) / 255.0);

    Ok(Hex { r, g, b, a })
  }
}

impl From<Hex> for String {
  fn from(hex: Hex) -> Self {
    let mut result = format!("#{:02x}{:02x}{:02x}", hex.r, hex.g, hex.b);

    if let Some(a) = hex.a {
      let a = (a * 255.0) as u8;
      let a = format!("{a:02x}");
      result.push_str(&a);
    }

    result
  }
}

impl fmt::Display for Hex {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", self.clone())
  }
}

#[cfg(test)]
mod tests {
  use super::*;
  use crate::color::Color;
  use regex::Regex;

  #[test]
  fn should_generate_random_hex() {
    let regex = Regex::new(HEX_REGEX).unwrap();
    let hex = String::from(Hex::random());
    assert!(regex.is_match(&hex));
  }

  #[test]
  fn should_generate_random_hex_with_alpha() {
    let regex = Regex::new(HEX_REGEX).unwrap();
    let hex = String::from(Hex::random_with_alpha());
    assert!(regex.is_match(&hex));
  }

  #[test]
  fn should_convert_string_to_hex() {
    let hex = Hex::try_from("#ff00ff").unwrap();
    assert_eq!(hex.r, 255);
    assert_eq!(hex.g, 0);
    assert_eq!(hex.b, 255);
    assert!(hex.a.is_none());
  }

  #[test]
  fn should_convert_string_to_hex_with_alpha() {
    let hex = Hex::try_from("#ff00ffaa").unwrap();
    assert_eq!(hex.r, 255);
    assert_eq!(hex.g, 0);
    assert_eq!(hex.b, 255);
    assert!(hex.a.is_some());
  }
}
