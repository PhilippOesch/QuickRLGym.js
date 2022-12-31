import { defineStore } from 'pinia';
//import { useStorage } from '@vueuse/core';
import { useStorage } from '@vueuse/core';
import { defaultSettings } from './useDefaultSettings';

const useSettingsStore = defineStore('algSettings', {
    state: () => ({
        settings: useStorage('settings', defaultSettings),
        // settings: defaultSettings,
    }),
    getters: {
        getSetting: (state) => {
            return (game: string, algorithm: string) => {
                const gameSetting = (state.settings as any)[game];
                return gameSetting[algorithm];
            };
        },
    },
    actions: {
        updateSetting(game: string, algorithm: string, setting: any) {
            const settings = this.settings as any;
            settings[game][algorithm] = {
                ...settings[game][algorithm],
                ...setting,
            };
            console.log(settings[game][algorithm]);
        },
    },
});

export default useSettingsStore;
