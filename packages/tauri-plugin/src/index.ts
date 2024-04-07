import { invoke } from '@tauri-apps/api/core';
import { type ErrorLog, type VersionSnapshot, getCurrentApp } from '@manatsu/shared';

/** Commands for the Tauri plugin, so one can easily `invoke` them. */
export enum Command {
  ErrorLogPath = 'plugin:manatsu|error_log_path',
  IsDev = 'plugin:manatsu|is_dev',
  ManatsuVersion = 'plugin:manatsu|manatsu_version',
  ReadErrorLogs = 'plugin:manatsu|read_error_logs',
  SaveErrorLog = 'plugin:manatsu|save_error_log',
  VersionSnapshot = 'plugin:manatsu|version_snapshot'
}

export function createVersionSnapshot(): Promise<VersionSnapshot> {
  const app = getCurrentApp();
  return invoke(Command.VersionSnapshot, {
    vue: app.version
  });
}

export function isDev(): Promise<boolean> {
  return invoke(Command.IsDev);
}

export function getErrorLogPath(): Promise<string> {
  return invoke(Command.ErrorLogPath);
}

export function getManatsuVersion(): Promise<string> {
  return invoke(Command.ManatsuVersion);
}

export function readErrorLogs(): Promise<ErrorLog[]> {
  return invoke(Command.ReadErrorLogs);
}

export function saveErrorLog(log: ErrorLog): Promise<void> {
  return invoke(Command.SaveErrorLog, { log });
}
