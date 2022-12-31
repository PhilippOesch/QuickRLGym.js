import { defineStore } from 'pinia';

const useSettingsStore = defineStore('algSettings', {
    state: () => ({
        settings: new Map<string, Map<string, any>>(),
    }),
    getters: {
        getSetting: (state) => {
            return (game: string, algorithm: string) => {
                if (state.settings.has(game)) return;
                const gameSetting = state.settings.get(game);
                if (gameSetting!.has(algorithm)) return;
                return gameSetting!.get(algorithm);
            };
        },
    },
    actions: {
        updateSetting(game: string, algorithm: string, setting: any) {
            if (!this.settings.has(game)) {
                this.settings.set(game, new Map<string, any>());
            }
            const gameSetting = this.settings.get(game);
            if (!gameSetting!.has(algorithm)) {
                gameSetting?.set(algorithm, new Map());
            }
            gameSetting!.set(algorithm, setting);
        },
    },
});

export default useSettingsStore;
