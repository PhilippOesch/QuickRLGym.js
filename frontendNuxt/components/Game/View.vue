<template>
    <div class="gameWrapper">
        <Tab tabGroup="trainingBenchmarkSwitch" name="Training">
            <div class="info">
                <div class="infoBox gameInfo">
                    <h2>Current Game Info:</h2>
                    <ul class="list" v-if="getGameInfo">
                        <li
                            class="flex gap-2"
                            v-for="(item, index) in getGameInfo"
                        >
                            <span>{{ index }}:</span><span>{{ item }}</span>
                        </li>
                    </ul>
                </div>
                <div class="infoBox trainingInfo">
                    <h2>Training Progress - Iteration {{ iteration }}</h2>
                    <ul class="list" v-if="stats">
                        <li class="flex gap-2" v-for="(item, index) in stats">
                            <span>{{ index }}:</span><span>{{ item }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </Tab>
        <div class="gameContainer" ref="gameContainer"></div>
    </div>
</template>

<script lang="ts">
import { Agent, Envs, SingleAgentEnvironment } from 'quickrl.core';
import { defineComponent } from 'vue';
import useGameEnv, { TaxiSceneInfo } from '~~/comsosable/useGameEnv';
import useSettingsStore from '~~/comsosable/useSettingsStore';
import useAgent from '~~/comsosable/useAgent';
import TaxiGameScene from '~~/utils/GameScenes/TaxiGameScene';
import { GameTrainingSettings } from '~~/comsosable/useDefaultSettings';
import { Environment } from 'quickrl.core';

interface InitialData {
    taxiEnvInfo?: TaxiSceneInfo;
    stats?: object;
    agent?: Agent;
    iteration: number;
    isTraining: false;
}

export default defineComponent({
    expose: ['startTraining'],
    props: {
        id: String,
    },
    setup() {
        const settingsStore = useSettingsStore();

        return { settingsStore };
    },
    data(): InitialData {
        return {
            taxiEnvInfo: undefined,
            stats: undefined,
            agent: undefined,
            iteration: 0,
            isTraining: false,
        };
    },
    methods: {
        async startTraining() {
            console.log('startTraining');

            if (!this.taxiEnvInfo) {
                return;
            }
            this.settingsStore.setActiveState('Taxi', false);

            const env: SingleAgentEnvironment = this.taxiEnvInfo.env as any;

            const gameSettings: GameTrainingSettings =
                this.settingsStore.getSetting('Taxi', 'gameSettings');
            const activeAlgorithm: string =
                this.settingsStore.getActiveAlgorithm('Taxi');
            const getAgentSettings = this.settingsStore.getSetting(
                'Taxi',
                activeAlgorithm
            );
            env.setOptions(gameSettings);

            const agent: Agent = await useAgent(
                activeAlgorithm,
                this.taxiEnvInfo.env,
                getAgentSettings,
                gameSettings.randomSeed
            );
            env.setAgent = agent;
            env.initAgent();
            this.trainingLoop(
                env,
                gameSettings.episodes,
                gameSettings.showProgressEvery
            );
        },
        async trainingLoop(
            env: SingleAgentEnvironment,
            iterationsLeft: number,
            trainingIterations: number
        ) {},
    },
    computed: {
        getGameInfo() {
            if (!this.taxiEnvInfo) return null;
            const info = this.taxiEnvInfo as TaxiSceneInfo;
            return {
                gameIteration: info.env.iteration,
                points: info.env.getReturn,
                destination:
                    TaxiGameScene.destMapping[info.env.game.customer.destIdx],
            };
        },
    },
    async mounted() {
        const gameContainer: HTMLElement = this.$refs
            .gameContainer as HTMLElement;
        window.Phaser = await import('phaser');
        console.log(window.Phaser);
        this.taxiEnvInfo = await useGameEnv(gameContainer);
        this.stats = this.taxiEnvInfo.env.stats;
        this.settingsStore.setActiveState('Taxi', true);
    },
});
</script>

<style lang="postcss" scoped>
.gameWrapper .info {
    @apply grid lg:grid-cols-6 gap-8 mb-4;
}

.gameWrapper .infoBox {
    @apply bg-slate-700 p-4 rounded-md;
}

.gameInfo {
    @apply lg:col-span-2;
}

.trainingInfo {
    @apply lg:col-span-4;
}

.infoBox h2 {
    @apply text-lg font-semibold;
}

.infoBox .list {
    @apply mt-2;
}

.gameContainer {
    @apply w-full bg-gray-800 rounded-md max-h-fit;
}

.gameWrapper {
    @apply w-full relative p-4 bg-gray-800 rounded-md drop-shadow;
}

.gameContainer :deep(canvas) {
    @apply pointer-events-none;
}
</style>
