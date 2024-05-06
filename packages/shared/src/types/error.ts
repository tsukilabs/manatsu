import type { Nullish } from '@tb-dev/utility-types';

export interface VersionSnapshot {
  app?: Nullish<string>;
  manatsu?: Nullish<string>;
  os?: Nullish<string>;
  tauri?: Nullish<string>;
  vue: string;
  webview?: Nullish<string>;
}

export interface Log {
  message: string;
  name: string;
  stack?: Nullish<string>;
  timestamp?: Nullish<string>;
  version: VersionSnapshot;
}
