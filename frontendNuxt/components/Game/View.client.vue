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

<script lang="ts" setup>
import { QuickRLJS, Agent, Agents, SingleAgentEnvironment } from 'quickrl.core';
import { defineProps, Ref } from 'vue';
import { SceneInfo } from '~~/comsosable/useGameEnv';
import useSettingsStore from '~~/comsosable/useSettingsStore';
import useAgent from '~~/comsosable/useAgent';
import { GameTrainingSettings } from '~~/comsosable/useDefaultSettings';
import useGetGameScene from '~~/comsosable/useGameEnv';
import StaticRenderScene from '~~/utils/GameScenes/StaticRenderScene';
import { Loader } from 'phaser';

const gameContainer: any = ref(null);

async function initializeTraining() {
    isTraining = true;
    iteration = 0;
    console.log('startTraining');

    if (!envInfo) {
        return;
    }
    settingsStore.setActiveState(props.id, false);

    await new Promise((f) => setTimeout(f, 50));

    const env: SingleAgentEnvironment = envInfo.env as any;

    const gameSettings: GameTrainingSettings = settingsStore.getSetting(
        props.id,
        'gameSettings'
    );
    const activeAlgorithm: string = settingsStore.getActiveAlgorithm(props.id);
    const getAgentSettings = settingsStore.getSetting(
        props.id,
        activeAlgorithm
    );
    env.setOptions(gameSettings);

    agent = useAgent(
        activeAlgorithm,
        envInfo.env,
        getAgentSettings,
        gameSettings.randomSeed
    );
    env.setAgent = agent as Agent;
    env.initAgent();

    trainingLoop(
        env,
        gameSettings.episodes,
        gameSettings.showProgressEvery,
        props.trainingIteration
    );
}

defineExpose({ initializeTraining });
const props = defineProps({
    id: {
        type: String,
        required: true,
    },
    trainingIteration: {
        type: Number,
        required: true,
    },
    renderBetweenMoves: {
        type: Number,
        default: 100,
    },
});
const settingsStore = useSettingsStore();

const counter = ref(0);

let envInfo: undefined | SceneInfo;
let stats: Ref<any> = ref(null);
let agent: undefined | Agent;
let iteration: number = 0;
let isTraining: boolean = false;

async function trainingLoop(
    env: SingleAgentEnvironment,
    iterationsLeft: number,
    trainingIterations: number,
    maxIterations: number
) {
    isTraining = true;
    if (iterationsLeft > trainingIterations) {
        const newIterationsLeft = iterationsLeft - trainingIterations;
        env.train(trainingIterations, -1, maxIterations);
        stats.value = env.stats;
        console.log(stats);
        iteration += trainingIterations;

        console.log('iteration', iteration);

        await renderGame();
        trainingLoop(env, newIterationsLeft, trainingIterations, maxIterations);
    } else {
        env.train(iterationsLeft, -1, maxIterations);
        iteration += iterationsLeft;
        stats.value = env.stats;
        console.log('iteration', env.iteration);
        settingsStore.setActiveState(props.id, true);
        console.log('end Training');
        isTraining = false;
    }
}
async function renderGame() {
    isTraining = false;
    const env: SingleAgentEnvironment = envInfo!.env as any;
    const gameScene: StaticRenderScene = envInfo!
        .gameScene as StaticRenderScene;

    env.reset();
    gameScene.reRender();
    getGameInfo.value = envInfo?.gameScene.gameInfo;
    await new Promise((f) => setTimeout(f, 1000));

    while (!env.isTerminal && env.iteration <= 25) {
        await new Promise((f) => setTimeout(f, props.renderBetweenMoves));
        const nextAction = agent!.evalStep(env.state);
        env.step(nextAction);
        gameScene.reRender();
        getGameInfo.value = envInfo?.gameScene.gameInfo;
    }
    await new Promise((f) => setTimeout(f, 200));
}
function loadEnv() {
    const env: SingleAgentEnvironment = QuickRLJS.loadEnv(
        props.id
    ) as SingleAgentEnvironment;
    const randAgent = new Agents.RandomAgent(env);
    env.setAgent = randAgent;
    env.initAgent();
    return env;
}
// const getGameInfo = computed(() => {
//     return envInfo?.gameScene.gameInfo;
// });
const getGameInfo = ref();
onMounted(async () => {
    if (!isTraining) settingsStore.setActiveState(props.id, true);
    // wait for components to be rendered
    await nextTick();
    const parent = gameContainer.value as HTMLElement;
    envInfo = useGetGameScene(props.id, parent);
    stats.value = envInfo?.env.stats;
    getGameInfo.value = envInfo?.gameScene.gameInfo;
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
    @apply w-full bg-slate-800 rounded-md max-h-fit relative;
}

.gameContainer :deep(canvas) {
    @apply pointer-events-none;
}
</style>
