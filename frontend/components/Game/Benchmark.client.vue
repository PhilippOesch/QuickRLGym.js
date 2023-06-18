<template>
    <div class="gameWrapper">
        <div class="info" :key="counter">
            <InfoBox
                title="Current Game Info:"
                :content="<object>reactiveInfo.gameInfo"
                styleClasses="gameInfo"
            />
            <InfoBox
                :title="<any>benchmarkTitleRef.valueRef"
                :content="<object>reactiveInfo.stats"
                styleClasses="trainingInfo"
            />
        </div>
        <div ref="gameContainer" class="gameContainer"></div>
    </div>
</template>

<script setup lang="ts">
import { Ref } from 'vue';
import { Agent, SingleAgentEnvironment, Utils } from 'quickrl.core';
import { SceneInfo } from '~~/comsosable/useGameEnv';
import useGetGameScene from '~~/comsosable/useGameEnv';
import useSettingsStore from '~~/comsosable/useSettingsStore';
import { GameBenchmarkSettings } from '~~/comsosable/useDefaultSettings';
import { renderGame } from '~~/utils/GameScenes/helpers';
import { mappedRef } from 'mappedref-vue';
import { GameViewProps } from '~/utils/PropTypes';

enum BenchmarkState {
    NotStarted,
    InProgress,
    Finished,
}

const props = withDefaults(defineProps<GameViewProps>(), {
    renderBetweenMoves: 100,
});

const benchmarkTitleRef = mappedRef(
    'not Initialed',
    ref(BenchmarkState.NotStarted)
);
benchmarkTitleRef.set(
    BenchmarkState.NotStarted,
    () => 'Benchmark has not been started:'
);
benchmarkTitleRef.set(
    BenchmarkState.InProgress,
    () => `Benchmark Progress - Iteration ${iteration.value}`
);
benchmarkTitleRef.set(
    BenchmarkState.Finished,
    () => `Final Result after ${iteration.value} Iterations:`
);

let sceneInfo: SceneInfo | undefined;

let iteration: Ref<number> = ref(0);

const counter = ref(0);

const emit = defineEmits(['initializeScene']);

const settingsStore = useSettingsStore();

let reactiveInfo = reactive({
    gameInfo: null as object | null,
    stats: null as object | null,
});

let benchmarkSettings: GameBenchmarkSettings;

const gameContainer: any = ref(null);

let agent: Agent | undefined = undefined;

onMounted(async () => {
    await nextTick();
    const parent = gameContainer.value as HTMLElement;
    sceneInfo = useGetGameScene(props.id, parent) as SceneInfo;
    emit('initializeScene', sceneInfo.env);
});

async function initializeBenchmark() {
    benchmarkTitleRef.keyRef = BenchmarkState.NotStarted;
    iteration.value = 0;
    if (!sceneInfo) {
        return;
    }

    settingsStore.setActiveState(props.id, false);

    await new Promise((f) => setTimeout(f, 50));

    const env: SingleAgentEnvironment = sceneInfo?.env as any;

    benchmarkSettings = settingsStore.getSetting(props.id, 'benchmarkSettings');

    if (benchmarkSettings) {
        env.setOptions(benchmarkSettings);
    }

    if (props.agent !== undefined) {
        agent = props.agent;
        console.log('current agent:', agent);
    }

    env.resetStats();
    benchmarkTitleRef.keyRef = BenchmarkState.InProgress;

    benchmarkLoop(
        env,
        benchmarkSettings.benchmarkGames,
        benchmarkSettings.simulateGameEvery,
        props.maxGameIteration
    );
}

defineExpose({ initializeBenchmark });

async function benchmarkLoop(
    env: SingleAgentEnvironment,
    iterationsLeft: number,
    benchmarkIterations: number,
    maxIterations: number
) {
    if (iterationsLeft > benchmarkIterations) {
        const newIterationsLeft = iterationsLeft - benchmarkIterations;
        Utils.Evaluation.benchmarkSingleAgent(
            env,
            agent!,
            benchmarkIterations,
            benchmarkSettings.randomSeed,
            props.maxGameIteration,
            false
        );
        iteration.value += benchmarkIterations;
        reactiveInfo.stats = sceneInfo!.env!.stats;
        await renderGame(sceneInfo!, agent!, reactiveInfo);
        benchmarkLoop(
            env,
            newIterationsLeft,
            benchmarkIterations,
            maxIterations
        );
    } else {
        Utils.Evaluation.benchmarkSingleAgent(
            env,
            agent!,
            iterationsLeft,
            benchmarkSettings.randomSeed,
            props.maxGameIteration,
            false
        );
        iteration.value += iterationsLeft;
        console.log('iteration', env.iteration);
        await renderGame(sceneInfo!, agent!, reactiveInfo);
        reactiveInfo.stats = sceneInfo!.env!.stats;
        settingsStore.setActiveState(props.id, true);
        benchmarkTitleRef.keyRef = BenchmarkState.Finished;
    }
}
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
