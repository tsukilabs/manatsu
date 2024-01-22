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

    $crate::output!(std::process::Command::new("cargo"), args)
  }};
  ($args:expr) => {{
    $crate::output!(std::process::Command::new("cargo"), $args)
  }};
}

/// Executes `pnpm` with the specified arguments.
#[macro_export]
macro_rules! pnpm {
  ($( $arg:literal ),*) => {{
    let mut args: Vec<&str> = Vec::new();
    $( args.push($arg); )*

    $crate::output!($crate::win_cmd!("pnpm"), args)
  }};
  ($args:expr) => {{
    $crate::output!($crate::win_cmd!("pnpm"), $args)
  }};
}

/// Wrap [std::process::Command], executing `cmd` as the program if the current OS is Windows.
///
/// This is only useful in some very specific cases.
#[doc(hidden)]
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

#[doc(hidden)]
#[macro_export]
macro_rules! output {
  ($cmd:expr, $args:expr) => {{
    $cmd
      .args($args)
      .stderr(std::process::Stdio::inherit())
      .stdout(std::process::Stdio::inherit())
      .output()
  }};
}
