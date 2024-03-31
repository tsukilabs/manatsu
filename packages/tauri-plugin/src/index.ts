import { invoke } from '@tauri-apps/api/core';
import { type ErrorLog, type VersionSnapshot, getCurrentApp } from '@manatsu/shared';

/** Commands for the Tauri plugin, so one can easily `invoke` them. */
export enum Command {
  ErrorLogPath = 'plugin:manatsu|error_log_path',
  ManatsuVersion = 'plugin:manatsu|manatsu_version',
  ReadErrorLogs = 'plugin:manatsu|read_error_logs',
  SaveErrorLog = 'plugin:manatsu|save_error_log',
  VersionSnapshot = 'plugin:manatsu|version_snapshot'
}

export function errorLogPath(): Promise<string> {
  return invoke(Command.ErrorLogPath);
}

export function manatsuVersion(): Promise<string> {
  return invoke(Command.ManatsuVersion);
}

export function readErrorLogs(): Promise<ErrorLog[]> {
  return invoke(Command.ReadErrorLogs);
}

export function saveErrorLog(log: ErrorLog): Promise<void> {
  return invoke(Command.SaveErrorLog, { log });
}

export function versionSnapshot(): Promise<VersionSnapshot> {
  const app = getCurrentApp();
  return invoke(Command.VersionSnapshot, {
    vue: app.version
  });
}
