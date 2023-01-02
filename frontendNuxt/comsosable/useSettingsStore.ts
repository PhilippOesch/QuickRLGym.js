import { defineStore } from 'pinia';
import { useStorage } from '@vueuse/core';
import { defaultSettings } from './useDefaultSettings';
import { ISettingsStore } from './useDefaultSettings';

const useSettingsStore = defineStore('algSettings', {
    state: () => ({
        settings: useStorage('settings', defaultSettings),
    }),
    getters: {
        getSetting: (state) => {
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
            console.log(settings[game][algorithm]);
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
