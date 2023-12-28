#[derive(Clone)]
pub enum Template {
  Vue,
}

impl Template {
  pub fn url(&self) -> String {
    let name: &str = self.clone().into();
    format!("https://github.com/manatsujs/{name}/archive/refs/heads/main.zip")
  }
}

impl From<&str> for Template {
  fn from(_: &str) -> Self {
    Template::Vue
  }
}

impl From<Template> for &str {
  fn from(_: Template) -> Self {
    "template-vue"
  }
}

impl From<String> for Template {
  fn from(_: String) -> Self {
    Template::Vue
  }
}

impl From<Template> for String {
  fn from(_: Template) -> Self {
    String::from("template-vue")
  }
}