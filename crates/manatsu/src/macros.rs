#[doc(hidden)]
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

#[doc(hidden)]
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

#[doc(hidden)]
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
