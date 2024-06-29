<template>
    <div class="gameWrapper">
        <div class="info" :key="counter">
            <InfoBox
                title="Current Game Info:"
                :content="<object>reactiveInfo.gameInfo"
                styleClasses="gameInfo"
            />
            <InfoBox
                :title="`Training Progress - Iteration ${iteration}`"
                :content="<object>reactiveInfo.stats"
                styleClasses="trainingInfo"
            />
        </div>
        <div ref="gameContainer" class="gameContainer"></div>
    </div>
</template>

<script lang="ts" setup>
import { Agent, Environment, SingleAgentEnvironment } from 'quickrl.core';
import { type SceneInfo } from '~~/comsosable/useGameEnv';
import useSettingsStore from '~~/comsosable/useSettingsStore';
import useAgent from '~~/comsosable/useAgent';
import { type GameTrainingSettings } from '~~/comsosable/useDefaultSettings';
import useGameSceneFactory from '~~/comsosable/useGameEnv';
import { renderGame } from '~~/utils/GameScenes/helpers';
import { type GameViewProps } from '~~/types/PropTypes';

const props = withDefaults(defineProps<GameViewProps>(), {
    renderBetweenMoves: 100,
});

const gameContainer = ref(null);

async function initializeTraining() {
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
    env.agent = agent as Agent;

    trainingLoop(
        env,
        gameSettings.episodes,
        gameSettings.showProgressEvery,
        props.maxGameIteration
    );
}

defineExpose({ initializeTraining });

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
    if (iterationsLeft > trainingIterations) {
        const newIterationsLeft = iterationsLeft - trainingIterations;
        await env.train(trainingIterations, -1, maxIterations);
        iteration.value += trainingIterations;
        reactiveInfo.stats = sceneInfo!.env!.stats;

        console.log(reactiveInfo.stats);
        console.log('iteration', iteration.value);

        await renderGame(
            sceneInfo!,
            agent!,
            reactiveInfo,
            maxIterations,
            1000,
            props.renderBetweenMoves,
            1000
        );
        trainingLoop(env, newIterationsLeft, trainingIterations, maxIterations);
    } else {
        await env.train(iterationsLeft, -1, maxIterations);
        iteration.value += iterationsLeft;
        console.log('iteration', iteration.value);
        settingsStore.setActiveState(props.id, true);
        await renderGame(
            sceneInfo!,
            agent!,
            reactiveInfo,
            maxIterations,
            1000,
            props.renderBetweenMoves,
            1000
        );
        console.log('end Training');
        reactiveInfo.stats = sceneInfo!.env!.stats;
        emit('passAgent', agent);
    }
}

onMounted(async () => {
    settingsStore.setActiveState(props.id, true);
    await nextTick();
    const parent = gameContainer.value as HTMLElement;
    sceneInfo = useGameSceneFactory(props.id, parent) as SceneInfo;
    emit('initializeScene', sceneInfo.env);

    reactiveInfo.gameInfo = sceneInfo.gameScene!.gameInfo;
    reactiveInfo.stats = sceneInfo.env!.stats;
});
</script>

<style lang="postcss" scoped>
.gameWrapper .info {
    @apply mb-4 grid gap-8 lg:grid-cols-6;
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

.gameContainer {
    @apply relative max-h-fit w-full rounded-md bg-darkPurple-800;
}

.gameContainer :deep(canvas) {
    @apply pointer-events-none;
}
</style>
~/types/PropTypes
