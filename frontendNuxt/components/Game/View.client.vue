<template>
    <div class="gameWrapper">
        <Tab tabGroup="trainingBenchmarkSwitch" name="Training">
            <div class="info" :key="counter">
                <div class="infoBox gameInfo">
                    <h2>Current Game Info:</h2>
                    <ul class="list" v-if="reactiveInfo.gameInfo">
                        <li
                            class="flex gap-2"
                            v-for="(item, index) in reactiveInfo.gameInfo"
                        >
                            <span>{{ index }}:</span><span>{{ item }}</span>
                        </li>
                    </ul>
                </div>
                <div class="infoBox trainingInfo">
                    <h2>Training Progress - Iteration {{ iteration }}</h2>
                    <ul class="list" v-if="reactiveInfo.stats">
                        <li
                            class="flex gap-2"
                            v-for="(item, index) in reactiveInfo.stats"
                        >
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
import { Agent, Environment, SingleAgentEnvironment } from 'quickrl.core';
import { PropType, Ref } from 'vue';
import { SceneInfo } from '~~/comsosable/useGameEnv';
import useSettingsStore from '~~/comsosable/useSettingsStore';
import useAgent from '~~/comsosable/useAgent';
import { GameTrainingSettings } from '~~/comsosable/useDefaultSettings';
import useGetGameScene from '~~/comsosable/useGameEnv';
import StaticRenderScene from '~~/utils/GameScenes/StaticRenderScene';
import { Loader } from 'phaser';

const gameContainer: any = ref(null);

let isTraining: Ref<boolean> = ref(false);

async function initializeTraining() {
    isTraining.value = true;
    iteration.value = 0;
    console.log('startTraining');

    if (!sceneInfo) {
        return;
    }
    settingsStore.setActiveState(props.id, false);

    await new Promise((f) => setTimeout(f, 50));

    const env: SingleAgentEnvironment = sceneInfo?.env as any;

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

    if (props.agent == undefined) {
        agent = useAgent(
            activeAlgorithm,
            sceneInfo?.env as Environment,
            getAgentSettings,
            gameSettings.randomSeed
        );
    } else {
        agent = props.agent;
        agent.setConfig(getAgentSettings, gameSettings.randomSeed);
    }
    console.log('initial Agent', agent);
    env.setAgent = agent as Agent;

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
    agent: {
        type: Object as PropType<Agent>,
    },
});
const settingsStore = useSettingsStore();

const counter = ref(0);

let reactiveInfo = reactive({
    gameInfo: null as object | null,
    stats: null as object | null,
});
let agent: undefined | Agent;
let iteration: Ref<number> = ref(0);
let sceneInfo: SceneInfo | undefined;

const emit = defineEmits(['passAgent', 'initializeScene']);

async function trainingLoop(
    env: SingleAgentEnvironment,
    iterationsLeft: number,
    trainingIterations: number,
    maxIterations: number
) {
    isTraining.value = true;
    if (iterationsLeft > trainingIterations) {
        const newIterationsLeft = iterationsLeft - trainingIterations;
        await env.train(trainingIterations, -1, maxIterations);
        iteration.value += trainingIterations;
        reactiveInfo.stats = sceneInfo!.env!.stats;

        console.log(reactiveInfo.stats);
        console.log('iteration', iteration.value);

        await renderGame();
        trainingLoop(env, newIterationsLeft, trainingIterations, maxIterations);
    } else {
        await env.train(iterationsLeft, -1, maxIterations);
        iteration.value += iterationsLeft;
        console.log('iteration', env.iteration);
        settingsStore.setActiveState(props.id, true);
        await renderGame();
        console.log('end Training');
        isTraining.value = false;
        reactiveInfo.stats = sceneInfo!.env!.stats;
        emit('passAgent', agent);
    }
}
async function renderGame() {
    isTraining.value = false;
    const env: SingleAgentEnvironment = sceneInfo!.env as any;
    const gameScene: StaticRenderScene = sceneInfo!
        .gameScene as StaticRenderScene;

    env.reset();
    gameScene.reRender();
    await new Promise((f) => setTimeout(f, 1000));

    while (!env.isTerminal && env.iteration <= 25) {
        await new Promise((f) => setTimeout(f, props.renderBetweenMoves));
        const nextAction = agent!.evalStep(env.state);
        env.step(nextAction);
        gameScene.reRender();
        reactiveInfo.gameInfo = sceneInfo!.gameScene!.gameInfo;
    }
    await new Promise((f) => setTimeout(f, 200));
}

//const getGameInfo = ref();

onMounted(async () => {
    if (!isTraining.value) settingsStore.setActiveState(props.id, true);
    await nextTick();
    const parent = gameContainer.value as HTMLElement;
    sceneInfo = useGetGameScene(props.id, parent) as SceneInfo;
    emit('initializeScene', sceneInfo.env);

    reactiveInfo.gameInfo = sceneInfo.gameScene!.gameInfo;
    reactiveInfo.stats = sceneInfo.env!.stats;
});
</script>

<style lang="postcss" scoped>
.gameWrapper .info {
    @apply mb-4 grid gap-8 lg:grid-cols-6;
}

.gameWrapper .infoBox {
    @apply rounded-md bg-darkPurple-800 p-4;
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
    @apply relative max-h-fit w-full rounded-md bg-darkPurple-800;
}

.gameContainer :deep(canvas) {
    @apply pointer-events-none;
}
</style>
