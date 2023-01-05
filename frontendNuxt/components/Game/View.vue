<template>
    <div class="gameWrapper">
        <Tab tabGroup="trainingBenchmarkSwitch" name="Training">
            <div class="info" :key="counter">
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
import { Agent, Environment, Envs, SingleAgentEnvironment } from 'quickrl.core';
import { defineComponent, Ref } from 'vue';
import useGameEnv, { TaxiSceneInfo } from '~~/comsosable/useGameEnv';
import useSettingsStore from '~~/comsosable/useSettingsStore';
import useAgent from '~~/comsosable/useAgent';
import TaxiGameScene from '~~/utils/GameScenes/TaxiGameScene';
import { GameTrainingSettings } from '~~/comsosable/useDefaultSettings';
import { TaxiEnv } from 'quickrl.core/out/Envs';

interface InitialData {
    taxiEnvInfo?: TaxiSceneInfo;
    stats?: object;
    agent?: Agent;
    iteration: number;
    isTraining: boolean;
}

export default defineComponent({
    expose: ['initializeTraining'],
    props: {
        id: String,
    },
    setup() {
        const settingsStore = useSettingsStore();

        const counter = useState('counter', () => 0);

        return { settingsStore, counter };
    },
    data() {
        return {
            taxiEnvInfo: undefined as undefined | TaxiSceneInfo,
            stats: undefined as undefined | object,
            agent: undefined as undefined | Agent,
            iteration: 0,
            isTraining: false,
            lastAction: undefined as undefined | string,
        };
    },
    methods: {
        async initializeTraining() {
            this.iteration = 0;
            console.log('startTraining');

            if (!this.taxiEnvInfo) {
                return;
            }
            this.settingsStore.setActiveState('Taxi', false);

            await new Promise((f) => setTimeout(f, 50));

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

            this.agent = useAgent(
                activeAlgorithm,
                this.taxiEnvInfo.env,
                getAgentSettings,
                gameSettings.randomSeed
            );
            env.setAgent = this.agent as Agent;
            env.initAgent();

            this.trainingLoop(
                env,
                gameSettings.episodes,
                gameSettings.showProgressEvery,
                25
            );
        },
        async trainingLoop(
            env: SingleAgentEnvironment,
            iterationsLeft: number,
            trainingIterations: number,
            maxIterations: number
        ) {
            if (iterationsLeft > trainingIterations) {
                const newIterationsLeft = iterationsLeft - trainingIterations;
                env.train(trainingIterations, -1, maxIterations);
                this.stats = env.stats;
                console.log(this.stats);
                this.iteration += trainingIterations;

                console.log('iteration', this.iteration);

                await this.renderGame();
                this.trainingLoop(
                    env,
                    newIterationsLeft,
                    trainingIterations,
                    maxIterations
                );
            } else {
                env.train(iterationsLeft, -1, maxIterations);
                this.iteration += iterationsLeft;
                this.stats = env.stats;
                console.log('iteration', env.iteration);
                this.settingsStore.setActiveState('Taxi', true);
                console.log('end Training');
            }
        },
        async renderGame() {
            const env: Envs.TaxiEnv = this.taxiEnvInfo!.env as Envs.TaxiEnv;
            const gameScene: TaxiGameScene = this.taxiEnvInfo!
                .gameScene as TaxiGameScene;

            env.reset();
            gameScene.reRender();
            await new Promise((f) => setTimeout(f, 1000));

            while (!env.isTerminal && env.iteration <= 25) {
                await new Promise((f) => setTimeout(f, 100));
                const nextAction = this.agent!.evalStep(env.state);
                this.lastAction = nextAction;
                env.step(nextAction);
                gameScene.reRender();
            }
            await new Promise((f) => setTimeout(f, 200));
        },
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
                lastAction: this.lastAction,
            };
        },
    },
    async mounted() {
        if (!this.isTraining) this.settingsStore.setActiveState('Taxi', true);

        const gameContainer: HTMLElement = this.$refs
            .gameContainer as HTMLElement;
        window.Phaser = await import('phaser');
        this.taxiEnvInfo = await useGameEnv(gameContainer);
        this.stats = this.taxiEnvInfo.env.stats;
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
