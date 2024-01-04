# Manatsu

> This is work in progress and **SHOULD NOT** be used in production environments.

Manatsu is a [Vue](https://vuejs.org/) component library, designed from the outset to integrate with [Tauri](https://tauri.app/) apps.

```bash
cargo install manatsu
manatsu create
```

## Contributing

The following tools are required when contributing to Manatsu:

- [Node](https://nodejs.org) (version 20 or higher)
- [pnpm](https://pnpm.io/) (version 8 or higher)
- [Rust](https://www.rust-lang.org/tools/install)
- [@antfu/ni](https://github.com/antfu/ni)

### Setup

```bash
cargo install manatsu tauri-cli
npm install -g @antfu/ni

git clone https://github.com/manatsujs/manatsu.git
cd manatsu
ni install
```

## License

[MIT](https://raw.githubusercontent.com/manatsujs/manatsu/main/LICENSE)

Copyright (c) 2023 Andrew Ferreira
