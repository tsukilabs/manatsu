import { definePreset, type Preset, type PresetFactory } from 'unocss';
import { rules } from '../base';

export const ManatsuDark: PresetFactory = definePreset(() => {
    const preset: Preset = {
        name: 'manatsu-dark',
        rules: [...rules]
    };

    return preset;
});

export default ManatsuDark;
