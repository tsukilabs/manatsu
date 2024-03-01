use super::hex::Hex;
use super::rgb::Rgb;
use super::Color;
use serde::{Deserialize, Serialize};
use std::fmt;

/// Represents an HSL color.
#[derive(Clone, Deserialize, Serialize)]
pub struct Hsl {
  pub h: f64,
  pub s: f64,
  pub l: f64,
  pub a: Option<f64>,
}

impl Color for Hsl {
  /// Generate a random HSL color.
  fn random() -> Self {
    use rand::Rng;

    let mut rng = rand::thread_rng();
    let h: f64 = rng.gen_range(0.0..=360.0);
    let s: f64 = rng.gen_range(0.0..=1.0);
    let l: f64 = rng.gen_range(0.0..=1.0);

    Hsl { h, s, l, a: None }
  }

  /// Generate a random HSL color with an alpha value.
  fn random_with_alpha() -> Self {
    use rand::Rng;

    let hsl = Self::random();
    let a: f64 = rand::thread_rng().gen_range(0.0..=1.0);

    Hsl {
      h: hsl.h,
      s: hsl.s,
      l: hsl.l,
      a: Some(a),
    }
  }
}

impl From<Rgb> for Hsl {
  fn from(rgb: Rgb) -> Self {
    let red = f64::from(rgb.r) / 255.0;
    let green = f64::from(rgb.g) / 255.0;
    let blue = f64::from(rgb.b) / 255.0;

    let max = red.max(green).max(blue);
    let min = red.min(green).min(blue);
    let delta = max - min;
    let lightness = (max + min) / 2.0;

    if (max - min).abs() < f64::EPSILON {
      return Self {
        h: 0.0,
        s: 0.0,
        l: lightness,
        a: rgb.a,
      };
    }

    let mut hue = if (max - red).abs() < f64::EPSILON {
      (green - blue) / delta
    } else if (max - green).abs() < f64::EPSILON {
      2.0 + (blue - red) / delta
    } else {
      4.0 + (red - green) / delta
    };

    hue *= 60.0;

    if hue < 0.0 {
      hue += 360.0;
    }

    let saturation = if lightness <= 0.5 {
      delta / (max + min)
    } else {
      delta / (2.0 - delta)
    };

    Self {
      h: hue,
      s: saturation,
      l: lightness,
      a: rgb.a,
    }
  }
}

impl From<Hex> for Hsl {
  fn from(hex: Hex) -> Self {
    Self::from(Rgb::from(hex))
  }
}

impl From<Hsl> for String {
  fn from(hsl: Hsl) -> Self {
    let mut result = format!("hsl({} {}% {}%", hsl.h, hsl.s * 100.0, hsl.l * 100.0);

    if let Some(a) = hsl.a {
      result.push_str(&format!(" / {}%", a * 100.0));
    }

    result.push(')');
    result
  }
}

impl fmt::Display for Hsl {
  fn fmt(&self, f: &mut fmt::Formatter<'_>) -> fmt::Result {
    write!(f, "{}", String::from(self.clone()))
  }
}

#[cfg(test)]
mod tests {
  use super::*;

  #[test]
  fn should_convert_rgb_to_hsl() {
    let rgb = Rgb {
      r: 63,
      g: 191,
      b: 64,
      a: None,
    };

    let hsl = Hsl::from(rgb);
    assert!(hsl.h >= 120.46 && hsl.h < 120.47);
    assert!(hsl.s >= 0.503 && hsl.s < 0.504);
    assert!(hsl.l >= 0.498 && hsl.l < 0.499);
  }

  #[test]
  fn should_convert_hex_to_hsl() {
    let hex = Hex {
      r: 0x3f,
      g: 0xbf,
      b: 0x40,
      a: None,
    };

    let hsl = Hsl::from(hex);
    assert!(hsl.h >= 120.46 && hsl.h < 120.47);
    assert!(hsl.s >= 0.503 && hsl.s < 0.504);
    assert!(hsl.l >= 0.498 && hsl.l < 0.499);
  }
}
