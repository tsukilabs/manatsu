use std::fmt::Display;

pub trait VueString<T: AsRef<str> + Display> {
  /// Append `.vue` to the end of the string.
  fn append_vue_ext(&self) -> String;
}

impl<T: AsRef<str> + Display> VueString<T> for T {
  fn append_vue_ext(&self) -> String {
    format!("{self}.vue")
  }
}