/// Wrap [std::process::Command], executing `cmd` as the program if the current OS is Windows.
///
/// This is only useful in some very specific cases.
#[macro_export]
macro_rules! win_cmd {
  ($program:literal) => {{
    let mut cmd = if cfg!(windows) {
      std::process::Command::new("cmd")
    } else {
      std::process::Command::new($program)
    };

    if cfg!(windows) {
      cmd.arg("/C").arg($program);
    };

    cmd
  }};
}

/// Executes `cargo` with the specified arguments.
///
/// # Examples
///
/// ```
/// let output = manatsu::cargo!("--version").unwrap();
/// assert!(output.status.success());
/// ```
#[macro_export]
macro_rules! cargo {
  ($( $arg:literal ),*) => {{
    let mut args: Vec<&str> = Vec::new();
    $( args.push($arg); )*

    std::process::Command::new("cargo")
      .args(args)
      .stderr(std::process::Stdio::inherit())
      .stdout(std::process::Stdio::inherit())
      .output()
  }};
  ($args:expr) => {{
    std::process::Command::new("cargo")
      .args($args)
      .stderr(std::process::Stdio::inherit())
      .stdout(std::process::Stdio::inherit())
      .output()
  }};
}

/// Executes `pnpm` with the specified arguments.
#[macro_export]
macro_rules! pnpm {
  ($( $arg:literal ),*) => {{
    let mut args: Vec<&str> = Vec::new();
    $( args.push($arg); )*

    $crate::win_cmd!("pnpm")
      .args(args)
      .stderr(std::process::Stdio::inherit())
      .stdout(std::process::Stdio::inherit())
      .output()
  }};
  ($args:expr) => {{
    $crate::win_cmd!("pnpm")
      .args($args)
      .stderr(std::process::Stdio::inherit())
      .stdout(std::process::Stdio::inherit())
      .output()
  }};
}
