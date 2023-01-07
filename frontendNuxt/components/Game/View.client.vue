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
        <div ref="gameContainer" class="gameContainer">
            <Loader text="Training..." v-if="isTraining"></Loader>
        </div>
    </div>
</template>

<script lang="ts">
import {
    QuickRLJS,
    Agent,
    Agents,
    Envs,
    SingleAgentEnvironment,
} from 'quickrl.core';
import { defineComponent } from 'vue';
import { TaxiSceneInfo } from '~~/comsosable/useGameEnv';
import useSettingsStore from '~~/comsosable/useSettingsStore';
import useAgent from '~~/comsosable/useAgent';
import TaxiGameScene from '~~/utils/GameScenes/TaxiGameScene';
import { GameTrainingSettings } from '~~/comsosable/useDefaultSettings';
import { Loader, Tab } from '~~/.nuxt/components';
import useStartScene from '~~/comsosable/useGameEnv';
import StaticRenderScene from '~~/utils/GameScenes/StaticRenderScene';

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
            phaserLoaded: false,
        };
    },
    methods: {
        async initializeTraining() {
            this.isTraining = true;
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
            this.isTraining = true;
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
            this.isTraining = false;
            const env: SingleAgentEnvironment = this.taxiEnvInfo!.env as any;
            const gameScene: StaticRenderScene = this.taxiEnvInfo!
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
        loadEnv() {
            const env: SingleAgentEnvironment = QuickRLJS.loadEnv(
                'Taxi'
            ) as SingleAgentEnvironment;
            const randAgent = new Agents.RandomAgent(env);
            env.setAgent = randAgent;
            env.initAgent();
            return env;
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
        // wait for components to be rendered
        await nextTick();
        const gameContainer = this.$refs.gameContainer as HTMLElement;
        const env = this.loadEnv();
        const gameScene: TaxiGameScene = new TaxiGameScene(env, false);
        this.taxiEnvInfo = useStartScene(gameScene, env, gameContainer);
        this.stats = this.taxiEnvInfo.env.stats;
    },
});
</script>

<style lang="postcss" scoped>
.gameWrapper .info {
    @apply grid lg:grid-cols-6 gap-8 mb-4;
}

.gameWrapper .infoBox {
    @apply bg-slate-800 p-4 rounded-md;
}

.gameWrapperContainer {
    @apply grid lg:grid-cols-6;
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
    @apply w-full bg-gray-800 rounded-md max-h-fit relative;
}

.gameContainer :deep(canvas) {
    @apply pointer-events-none;
}
</style>
