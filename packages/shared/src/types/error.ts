import type { App } from 'vue';
import type { Nullish } from '@tb-dev/utility-types';

export type ErrorHandler = (this: App, err: unknown) => void;

export interface VersionSnapshot {
  app?: Nullish<string>;
  manatsu?: Nullish<string>;
  os?: Nullish<string>;
  tauri?: Nullish<string>;
  vue: string;
  webview?: Nullish<string>;
}

export interface ErrorLog {
  message: string;
  name: string;
  stack?: Nullish<string>;
  timestamp?: Nullish<string>;
  version: VersionSnapshot;
}
