import { invoke } from '@tauri-apps/api/core';
import { type ErrorLog, type VersionSnapshot, getCurrentApp } from '@manatsu/shared';
import type { HexColor, HslColor, RgbColor } from './types';

export * from './types';

/** Commands for the Tauri plugin, so one can easily `invoke` them. */
export enum Command {
  ErrorLogPath = 'plugin:manatsu|error_log_path',
  HexToHsl = 'plugin:manatsu|hex_to_hsl',
  HexToRgb = 'plugin:manatsu|hex_to_rgb',
  HexToString = 'plugin:manatsu|hex_to_string',
  HslToHex = 'plugin:manatsu|hsl_to_hex',
  HslToRgb = 'plugin:manatsu|hsl_to_rgb',
  HslToString = 'plugin:manatsu|hsl_to_string',
  ManatsuVersion = 'plugin:manatsu|manatsu_version',
  RandomHexColor = 'plugin:manatsu|random_hex_color',
  RandomHslColor = 'plugin:manatsu|random_hsl_color',
  RandomRgbColor = 'plugin:manatsu|random_rgb_color',
  RandomStringHexColor = 'plugin:manatsu|random_string_hex_color',
  RandomStringHslColor = 'plugin:manatsu|random_string_hsl_color',
  RandomStringRgbColor = 'plugin:manatsu|random_string_rgb_color',
  ReadErrorLogs = 'plugin:manatsu|read_error_logs',
  RgbToHex = 'plugin:manatsu|rgb_to_hex',
  RgbToHsl = 'plugin:manatsu|rgb_to_hsl',
  RgbToString = 'plugin:manatsu|rgb_to_string',
  SaveErrorLog = 'plugin:manatsu|save_error_log',
  StringToHex = 'plugin:manatsu|string_to_hex',
  VersionSnapshot = 'plugin:manatsu|version_snapshot'
}

export function errorLogPath(): Promise<string> {
  return invoke(Command.ErrorLogPath);
}

export function hexToHsl(hex: HexColor): Promise<HslColor> {
  return invoke(Command.HexToHsl, { hex });
}

export function hexToRgb(hex: HexColor): Promise<RgbColor> {
  return invoke(Command.HexToRgb, { hex });
}

export function hexToString(hex: HexColor): Promise<string> {
  return invoke(Command.HexToString, { hex });
}

export function hslToHex(hsl: HslColor): Promise<HexColor> {
  return invoke(Command.HslToHex, { hsl });
}

export function hslToRgb(hsl: HslColor): Promise<RgbColor> {
  return invoke(Command.HslToRgb, { hsl });
}

export function hslToString(hsl: HslColor): Promise<string> {
  return invoke(Command.HslToString, { hsl });
}

export function manatsuVersion(): Promise<string> {
  return invoke(Command.ManatsuVersion);
}

export function randomHexColor(): Promise<HexColor> {
  return invoke(Command.RandomHexColor);
}

export function randomHslColor(): Promise<HslColor> {
  return invoke(Command.RandomHslColor);
}

export function randomRgbColor(): Promise<RgbColor> {
  return invoke(Command.RandomRgbColor);
}

export function randomStringHexColor(): Promise<string> {
  return invoke(Command.RandomStringHexColor);
}

export function randomStringHslColor(): Promise<string> {
  return invoke(Command.RandomStringHslColor);
}

export function randomStringRgbColor(): Promise<string> {
  return invoke(Command.RandomStringRgbColor);
}

export function readErrorLogs(): Promise<ErrorLog[]> {
  return invoke(Command.ReadErrorLogs);
}

export function rgbToHex(rgb: RgbColor): Promise<HexColor> {
  return invoke(Command.RgbToHex, { rgb });
}

export function rgbToHsl(rgb: RgbColor): Promise<HslColor> {
  return invoke(Command.RgbToHsl, { rgb });
}

export function rgbToString(rgb: RgbColor): Promise<string> {
  return invoke(Command.RgbToString, { rgb });
}

export function saveErrorLog(log: ErrorLog): Promise<void> {
  return invoke(Command.SaveErrorLog, { log });
}

export function stringToHex(string: string): Promise<HexColor> {
  return invoke(Command.StringToHex, { string });
}

export function versionSnapshot(): Promise<VersionSnapshot> {
  const app = getCurrentApp();
  return invoke(Command.VersionSnapshot, {
    vue: app.version
  });
}
