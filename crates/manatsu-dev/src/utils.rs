use crate::prelude::*;

#[derive(Deserialize)]
pub struct Config {
  pub github: bool,
  pub github_token: String,
}

impl Config {
  /// Read the local configuration file.
  pub fn read() -> Result<Config> {
    let path = env::current_dir()?.join("config.json");
    let config = fs::read_to_string(path)?;
    serde_json::from_str::<Config>(&config).map_err(Into::into)
  }
}

pub struct Formatter<'a> {
  glob: &'a str,
}

impl<'a> Formatter<'a> {
  pub fn new(glob: &'a str) -> Self {
    Self { glob }
  }

  /// Format files using Prettier.
  pub async fn format(&self) -> Result<()> {
    let mut args = vec!["exec", "prettier", "--write"];
    args.push(self.glob);

    println!("{}", "formatting files...".bright_cyan());
    let status = pnpm!(args).spawn()?.wait().await?;
    bail_on_status_err!(status, "{}", "failed to format files".red());

    Ok(())
  }
}

impl Default for Formatter<'_> {
  fn default() -> Self {
    Self::new(".")
  }
}

pub struct Linter<'a> {
  glob: &'a str,
  args: Vec<&'a str>,
}

impl<'a> Linter<'a> {
  pub fn new(glob: &'a str) -> Self {
    Self {
      glob,
      args: Vec::default(),
    }
  }

  pub fn arg(&mut self, arg: &'a str) -> &mut Self {
    self.args.push(arg);
    self
  }

  /// Lint files, fixing as many issues as possible.
  pub async fn lint(&mut self) -> Result<()> {
    let mut args = vec!["exec", "eslint", "--fix"];
    args.extend(mem::take(&mut self.args));
    args.push(self.glob);

    println!("{}", "linting files...".bright_cyan());
    let status = pnpm!(args).spawn()?.wait().await?;
    bail_on_status_err!(status, "{}", "failed to lint files".red());

    Ok(())
  }
}

impl Default for Linter<'_> {
  fn default() -> Self {
    Self::new(".")
  }
}
