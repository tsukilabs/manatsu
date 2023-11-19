import type { App } from 'vue';

export * from './components';

export function createManatsu() {
    return {
        install(_app: App, _options = {}) {}
    };
}
