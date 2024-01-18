use super::hex::Hex;
use super::hsl::Hsl;
use super::Color;
use serde::Serialize;
use std::fmt;

/// Represents an RGB color.
#[derive(Clone, Serialize)]
pub struct Rgb {
  pub r: u8,
  pub g: u8,
  pub b: u8,
  pub a: Option<f64>,
}

impl Color for Rgb {
  /// Generates a random RGB color.
  fn random() -> Self {
    use rand::Rng;

    let mut rng = rand::thread_rng();
    let r: u8 = rng.gen();
    let g: u8 = rng.gen();
    let b: u8 = rng.gen();

    Rgb { r, g, b, a: None }
  }

  /// Generates a random RGB color with an alpha value.
  fn random_with_alpha() -> Self {
    use rand::Rng;

    let rgb = Self::random();
    let a: f64 = rand::thread_rng().gen_range(0.0..=1.0);

    Rgb {
      r: rgb.r,
      g: rgb.g,
      b: rgb.b,
      a: Some(a),
    }
  }
}

impl From<Hsl> for Rgb {
  fn from(hsl: Hsl) -> Self {
    if hsl.s == 0.0 {
      let lightness = (hsl.l * 255.0) as u8;
      return Self {
        r: lightness,
        g: lightness,
        b: lightness,
        a: hsl.a,
      };
    };

    let hue = hsl.h / 360.0;
    let mut red = hue + 0.333;
    let mut green = hue;
    let mut blue = hue - 0.333;

    macro_rules! normalize {
      ($( $val:expr ),*) => {
        $(
          if $val < 0.0 {
            $val += 1.0;
          } else if $val > 1.0 {
            $val -= 1.0;
          }
        )*
      };
    }

    normalize!(red, green, blue);

    let q = if hsl.l < 0.5 {
      hsl.l * (1.0 + hsl.s)
    } else {
      hsl.l + hsl.s - (hsl.l * hsl.s)
    };

    let p = 2.0 * hsl.l - q;

    macro_rules! convert {
      ($( $val:expr ),*) => {
        $(
          $val = if 6.0 * $val < 1.0 {
            p + (q - p) * 6.0 * $val
          } else if 2.0 * $val < 1.0 {
            q
          } else if 3.0 * $val < 2.0 {
            p + (q - p) * (0.666 - $val) * 6.0
          } else {
            p
          };
        )*
      };
    }

    convert!(red, green, blue);

    Self {
      r: (red * 255.0) as u8,
      g: (green * 255.0) as u8,
      b: (blue * 255.0) as u8,
      a: hsl.a,
    }
  }
}

impl From<Hex> for Rgb {
  fn from(hex: Hex) -> Self {
    Self {
      r: hex.r,
      g: hex.g,
      b: hex.b,
      a: hex.a,
    }
  }
}

impl From<Rgb> for String {
  fn from(rgb: Rgb) -> Self {
    let mut result = format!("rgb({} {} {}", rgb.r, rgb.g, rgb.b);

    if let Some(a) = rgb.a {
      result.push_str(&format!(" / {}%", a * 100.0));
    }

    result.push(')');
    result
  }
}

impl fmt::Display for Rgb {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", String::from(self.clone()))
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn should_convert_hsl_to_rgb() {
    let hsl = Hsl {
      h: 120.0,
      s: 0.5,
      l: 0.5,
      a: None,
    };

    let rgb = Rgb::from(hsl);
    assert_eq!(rgb.r, 63);
    assert_eq!(rgb.g, 191);
    assert_eq!(rgb.b, 64);
  }

  #[test]
  fn should_convert_hex_to_rgb() {
    let hex = Hex {
      r: 0x3f,
      g: 0xbf,
      b: 0x40,
      a: None,
    };

    let rgb = Rgb::from(hex);
    assert_eq!(rgb.r, 63);
    assert_eq!(rgb.g, 191);
    assert_eq!(rgb.b, 64);
  }
}
