#[macro_export]
macro_rules! bail_on_output_error {
  ($output:expr) => {
    if !$output.status.success() {
      let stderr = String::from_utf8_lossy(&$output.stderr).into_owned();
      anyhow::bail!("{}", stderr);
    }
  };
}
