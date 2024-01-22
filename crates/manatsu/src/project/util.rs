use anyhow::Result;
use std::fs;
use std::path::Path;

pub(super) fn update_index_metadata<P, N>(dir_path: P, project_name: N) -> Result<()>
where
  P: AsRef<Path>,
  N: AsRef<str>,
{
  let path = dir_path.as_ref().join("index.html");
  let index_html = fs::read_to_string(&path)?;
  let index_html = index_html.replace("Manatsu", project_name.as_ref());

  fs::write(path, index_html)?;

  Ok(())
}
