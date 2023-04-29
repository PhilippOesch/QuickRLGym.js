import { defineStore } from 'pinia';
import { useLocalStorage } from '@vueuse/core';
import { defaultSettings } from './useDefaultSettings';
import { ISettingsStore } from './useDefaultSettings';

const useSettingsStore = defineStore('algSettings', {
    state: () => ({
        settings: useLocalStorage('settings', defaultSettings, {
            mergeDefaults: true,
        }),
    }),
    getters: {
        getSetting: (state) => {
            console.log('the state', state.settings);
            return (game: string, algorithm: string) => {
                const gameSetting = (state.settings as ISettingsStore)[game];
                return gameSetting[algorithm];
            };
        },
        getIsActive: (state) => {
            return (game: string) => {
                const gameSetting = (state.settings as ISettingsStore)[game];
                return gameSetting.settingsActive;
            };
        },
        getActiveAlgorithm: (state) => {
            return (game: string) => {
                const gameSetting = (state.settings as ISettingsStore)[game];
                return gameSetting.algorithmActive;
            };
        },
    },
    actions: {
        updateSetting(game: string, algorithm: string, setting: any) {
            const settings = this.settings as ISettingsStore;
            settings[game][algorithm] = {
                ...settings[game][algorithm],
                ...setting,
            };
        },
        setActiveState(game: string, activeState: boolean) {
            const gameSetting = (this.settings as ISettingsStore)[game];
            gameSetting.settingsActive = activeState;
        },
        setActiveAlgorithm(game: string, algorithm: string) {
            const gameSetting = (this.settings as ISettingsStore)[game];
            gameSetting.algorithmActive = algorithm;
        },
    },
});

export default useSettingsStore;
