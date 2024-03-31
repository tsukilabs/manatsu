#[macro_export]
macro_rules! command {
  ($program:expr) => {{
    let mut cmd = if cfg!(windows) {
      tokio::process::Command::new("cmd")
    } else {
      tokio::process::Command::new($program)
    };

    if cfg!(windows) {
      cmd.arg("/C").arg($program);
    };

    cmd
  }};
}

#[macro_export]
macro_rules! cargo {
  ($args:expr) => {{
    tokio::process::Command::new("cargo").args($args)
  }};

  ($( $arg:literal ),*) => {{
    let mut args: Vec<&str> = Vec::new();
    $( args.push($arg); )*

    $crate::cargo!(args)
  }};
}

#[macro_export]
macro_rules! pnpm {
  ($args:expr) => {{
    $crate::command!("pnpm").args($args)
  }};

  ($( $arg:literal ),*) => {{
    let mut args: Vec<&str> = Vec::new();
    $( args.push($arg); )*

    $crate::pnpm!(args)
  }};
}

#[macro_export]
macro_rules! bail_on_output_err {
  ($output:expr) => {
    if !$output.status.success() {
      let stderr = String::from_utf8_lossy(&$output.stderr).into_owned();
      anyhow::bail!("{}", stderr);
    }
  };
}

#[macro_export]
macro_rules! bail_on_status_err {
  ($status:expr, $($message:tt)*) => {
    if !$status.success() {
      anyhow::bail!($($message)*);
    }
  };
}
