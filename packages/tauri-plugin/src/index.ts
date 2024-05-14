import { version } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import type { Log, VersionSnapshot } from '@manatsu/shared';

/** Commands for the Tauri plugin, so one can easily `invoke` them. */
export enum Command {
  IsDev = 'plugin:manatsu|is_dev',
  ManatsuVersion = 'plugin:manatsu|manatsu_version',
  SaveLog = 'plugin:manatsu|save_log',
  VersionSnapshot = 'plugin:manatsu|version_snapshot'
}

export function createVersionSnapshot(): Promise<VersionSnapshot> {
  return invoke(Command.VersionSnapshot, { vue: version });
}

export function isDev(): Promise<boolean> {
  return invoke(Command.IsDev);
}

export function getManatsuVersion(): Promise<string> {
  return invoke(Command.ManatsuVersion);
}

export function saveLog(log: Log): Promise<void> {
  return invoke(Command.SaveLog, { log });
}
