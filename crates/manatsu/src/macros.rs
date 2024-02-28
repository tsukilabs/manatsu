/// Execute `cargo` with the specified arguments.
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

/// Execute `pnpm` with the specified arguments.
#[macro_export]
macro_rules! pnpm {
  ($args:expr) => {{
    miho::win_cmd!("pnpm").args($args)
  }};

  ($( $arg:literal ),*) => {{
    let mut args: Vec<&str> = Vec::new();
    $( args.push($arg); )*

    $crate::pnpm!(args)
  }};
}
