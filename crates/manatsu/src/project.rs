use crate::prelude::*;
use bytes::Bytes;
use reqwest::Client;
use semver::Version;
use std::io::Cursor;
use taplo::formatter;
use walkdir::WalkDir;
use zip::ZipArchive;

pub struct Project {
  pub name: String,
  pub description: Option<String>,
  pub author: Option<String>,
  pub force: bool,
  pub version: Version,
}

impl Project {
  /// <https://regex101.com/r/9dSatE>
  const NAME_REGEX: &'static str = r"^(?:@[a-z0-9-*~][a-z0-9-*._~]*/)?[a-z0-9-~][a-z0-9-._~]*$";

  /// Create a new Manatsu project from a template.
  ///
  /// Tauri: <https://github.com/ferreira-tb/manatsu-template-tauri>
  ///
  /// Vue: <https://github.com/ferreira-tb/manatsu-template-vue>
  pub async fn create(self) -> Result<()> {
    let start = Instant::now();

    if !Self::is_valid(&self.name) {
      bail!("invalid project name: {}", self.name);
    }

    let path = env::current_dir()?.join(&self.name);

    if path.try_exists()? {
      if self.force {
        fs::remove_dir_all(&path)?;
      } else {
        bail!("directory already exists: {}", path.display());
      }
    }

    println!("downloading template...");
    let bytes = self.download().await?;

    println!("building project...");
    fs::create_dir_all(&path).with_context(|| "could not create project dir")?;

    let cursor = Cursor::new(bytes);
    let mut zip = ZipArchive::new(cursor)?;
    zip.extract(&path)?;

    hoist_extracted_files(&path)?;
    self.update_project_metadata(&path)?;

    println!("built {} in {:?}", self.name, start.elapsed());

    Ok(())
  }

  async fn download(&self) -> Result<Bytes> {
    let client = Client::builder().brotli(true).gzip(true).build()?;
    let url = "https://github.com/ferreira-tb/template-tauri/archive/refs/heads/main.zip";
    let response = client
      .get(url)
      .timeout(Duration::from_secs(10))
      .send()
      .await
      .with_context(|| format!("could not fetch: {url}"))?;

    response.bytes().await.map_err(Into::into)
  }

  fn update_project_metadata(&self, path: &Path) -> Result<()> {
    self
      .update_package_json(path)?
      .update_cargo_toml(path)?
      .update_tauri_conf(path)?
      .update_index_html(path)?
      .update_readme_md(path)?;

    Ok(())
  }

  fn update_package_json(&self, dir_path: impl AsRef<Path>) -> Result<&Self> {
    let path = dir_path.as_ref().join("package.json");
    let package_json = fs::read_to_string(&path)?;
    let mut package_json: serde_json::Value = serde_json::from_str(&package_json)?;

    macro_rules! update {
      ($key:literal, $value:expr) => {
        package_json[$key] = serde_json::Value::String($value);
      };
    }

    update!("name", self.name.clone());
    update!("version", self.version.to_string());
    update!("description", self.description.clone().unwrap_or_default());

    let json = serde_json::to_string_pretty(&package_json)?;
    fs::write(path, json)?;

    Ok(self)
  }

  fn update_cargo_toml(&self, dir_path: impl AsRef<Path>) -> Result<&Self> {
    let glob = Glob::new("**/Cargo.toml")?.compile_matcher();
    let entries = WalkDir::new(dir_path)
      .into_iter()
      .filter_map(std::result::Result::ok)
      .filter(|e| glob.is_match(e.path()));

    for entry in entries {
      let path = entry.path();
      let cargo_toml = fs::read_to_string(path)?;
      let mut cargo_toml: toml::Value = toml::from_str(&cargo_toml)?;

      macro_rules! update {
        ($key:literal, $value:expr) => {
          if cargo_toml["package"].get($key).is_some() {
            cargo_toml["package"][$key] = toml::Value::String($value);
          }
        };
      }

      if cargo_toml.get("package").is_some() {
        update!("name", self.name.clone());
        update!("version", self.version.to_string());
        update!("description", self.description.clone().unwrap_or_default());
      }

      let options = formatter::Options::default();
      let cargo_toml = toml::to_string(&cargo_toml)?;
      let cargo_toml = formatter::format(&cargo_toml, options);

      fs::write(path, cargo_toml)?;
    }

    Ok(self)
  }

  fn update_tauri_conf(&self, dir_path: impl AsRef<Path>) -> Result<&Self> {
    let path = dir_path.as_ref().join("src-tauri/tauri.conf.json");
    let tauri_conf = fs::read_to_string(&path)?;
    let mut tauri_conf: serde_json::Value = serde_json::from_str(&tauri_conf)?;

    macro_rules! update {
      ($key:literal, $value:expr) => {
        tauri_conf[$key] = serde_json::Value::String($value);
      };
    }

    update!("productName", self.name.clone());
    update!("version", self.version.to_string());

    let title = self.name.to_case(Case::Title);
    tauri_conf["app"]["windows"][0]["title"] = serde_json::Value::String(title);

    let tauri_conf = serde_json::to_string_pretty(&tauri_conf)?;
    fs::write(path, tauri_conf)?;

    Ok(self)
  }

  fn update_index_html(&self, dir_path: impl AsRef<Path>) -> Result<&Self> {
    let path = dir_path.as_ref().join("index.html");
    let index_html = fs::read_to_string(&path)?;
    let index_html = index_html.replace("Manatsu", &self.name);

    fs::write(path, index_html)?;

    Ok(self)
  }

  fn update_readme_md(&self, dir_path: impl AsRef<Path>) -> Result<&Self> {
    let path = dir_path.as_ref().join("README.md");
    let readme_md = fs::read_to_string(&path)?;
    let mut readme_md = readme_md.replace("PROJECT_NAME", &self.name);

    if let Some(author) = &self.author {
      readme_md = readme_md.replace("Andrew Ferreira", author);
    }

    fs::write(path, readme_md)?;

    Ok(self)
  }

  pub fn is_valid(name: impl AsRef<str>) -> bool {
    let regex = Regex::new(Project::NAME_REGEX).unwrap();
    regex.is_match(name.as_ref())
  }
}

/// Build a globset to match files and directories to remove from the extracted template.
fn build_globset() -> GlobSet {
  let mut builder = GlobSetBuilder::new();

  macro_rules! add {
    ($glob:expr) => {
      builder.add(Glob::new($glob).unwrap());
    };
  }

  // Directories
  add!("**/dist");
  add!("**/target");
  add!("**/node_modules");
  add!("**/.github");

  // Files
  add!("**/LICENSE");
  add!("**/pnpm-lock.yaml");
  add!("**/*.lock");
  add!("**/*.log");
  add!("**/config.json");

  builder.build().unwrap()
}

fn find_extracted_dir(path: &Path) -> Result<PathBuf> {
  for entry in fs::read_dir(path)?.flatten() {
    let entry_path = entry.path();
    if entry.metadata()?.is_dir() {
      let file_name = entry.file_name();
      if matches!(file_name.to_str(), Some(n) if n.contains("template-tauri")) {
        return Ok(entry_path);
      }
    }

    remove_entry(&entry_path)?;
  }

  Err(anyhow!("could not find extracted folder"))
}

fn hoist_extracted_files(path: &Path) -> Result<()> {
  let globset = build_globset();
  let dir = find_extracted_dir(path)?;

  for entry in fs::read_dir(&dir)?.flatten() {
    let entry_path = entry.path();
    if globset.is_match(&entry_path) {
      remove_entry(&entry_path)
        .with_context(|| format!("could not remove: {}", entry_path.display()))?;
    } else {
      let target_path = path.join(entry.file_name());
      fs::rename(&entry_path, &target_path).with_context(|| {
        format!(
          "could not move: {} -> {}",
          entry_path.display(),
          target_path.display()
        )
      })?;
    }
  }

  fs::remove_dir_all(&dir).with_context(|| format!("could not remove: {}", dir.display()))?;

  Ok(())
}

fn remove_entry(path: impl AsRef<Path>) -> Result<()> {
  let path = path.as_ref();
  let metadata = path.metadata()?;
  if metadata.is_dir() {
    fs::remove_dir_all(path)?;
  } else if metadata.is_file() {
    fs::remove_file(path)?;
  }

  Ok(())
}
