export * from './types';

/** Commands for the Tauri plugin, so one can easily `invoke` them. */
export enum Command {
  HexToHsl = 'plugin:manatsu|hex_to_hsl',
  HexToRgb = 'plugin:manatsu|hex_to_rgb',
  HexToString = 'plugin:manatsu|hex_to_string',
  HslToHex = 'plugin:manatsu|hsl_to_hex',
  HslToRgb = 'plugin:manatsu|hsl_to_rgb',
  HslToString = 'plugin:manatsu|hsl_to_string',
  LogError = 'plugin:manatsu|log_error',
  ManatsuVersion = 'plugin:manatsu|manatsu_version',
  RandomHexColor = 'plugin:manatsu|random_hex_color',
  RandomHslColor = 'plugin:manatsu|random_hsl_color',
  RandomRgbColor = 'plugin:manatsu|random_rgb_color',
  RandomStringHexColor = 'plugin:manatsu|random_string_hex_color',
  RandomStringHslColor = 'plugin:manatsu|random_string_hsl_color',
  RandomStringRgbColor = 'plugin:manatsu|random_string_rgb_color',
  RgbToHex = 'plugin:manatsu|rgb_to_hex',
  RgbToHsl = 'plugin:manatsu|rgb_to_hsl',
  RgbToString = 'plugin:manatsu|rgb_to_string',
  StringToHex = 'plugin:manatsu|string_to_hex'
}
