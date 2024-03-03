export * from './types';

/** Commands for the Tauri plugin, so one can easily `invoke` them. */
export enum Command {
  HexToHsl = 'plugin:manatsu|hex_to_hsl',
  HexToRgb = 'plugin:manatsu|hex_to_rgb',
  HexToString = 'plugin:manatsu|hex_to_string',
  HslToHex = 'plugin:manatsu|hsl_to_hex',
  HslToRgb = 'plugin:manatsu|hsl_to_rgb',
  HslToString = 'plugin:manatsu|hsl_to_string',
  RandomHexColor = 'plugin:manatsu|random_hex_color',
  RandomHslColor = 'plugin:manatsu|random_hsl_color',
  RandomRgbColor = 'plugin:manatsu|random_rgb_color',
  RgbToHex = 'plugin:manatsu|rgb_to_hex',
  RgbToHsl = 'plugin:manatsu|rgb_to_hsl',
  RgbToString = 'plugin:manatsu|rgb_to_string',
  StringToHex = 'plugin:manatsu|string_to_hex'
}