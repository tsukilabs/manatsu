import { version } from 'vue';
import { invoke } from '@tauri-apps/api/core';
import type { Log, VersionSnapshot } from '@manatsu/shared';

/** Commands for the Tauri plugin, so one can easily `invoke` them. */
export enum Command {
  IsDev = 'plugin:manatsu|is_dev',
  LogPath = 'plugin:manatsu|log_path',
  ManatsuVersion = 'plugin:manatsu|manatsu_version',
  ReadLogs = 'plugin:manatsu|read_logs',
  SaveLog = 'plugin:manatsu|save_log',
  VersionSnapshot = 'plugin:manatsu|version_snapshot'
}

export function createVersionSnapshot(): Promise<VersionSnapshot> {
  return invoke(Command.VersionSnapshot, { vue: version });
}

export function isDev(): Promise<boolean> {
  return invoke(Command.IsDev);
}

export function getLogPath(): Promise<string> {
  return invoke(Command.LogPath);
}

export function getManatsuVersion(): Promise<string> {
  return invoke(Command.ManatsuVersion);
}

export function readLogs(): Promise<Log[]> {
  return invoke(Command.ReadLogs);
}

export function saveLog(log: Log): Promise<void> {
  return invoke(Command.SaveLog, { log });
}
