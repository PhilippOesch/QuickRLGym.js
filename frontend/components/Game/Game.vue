<template>
    <div>
        <SimpleTabSwitch
            groupName="trainingBenchmarkSwitch"
            :customBtnOpenClasses="getTabStyleClass()"
        />
        <SimpleTab tabGroup="trainingBenchmarkSwitch" tabName="Training">
            <SimpleTabSwitch
                :groupName="`${gameId}-AlgTab`"
                :customBtnOpenClasses="getTabStyleClass()"
                :on-before-switch="(evt: SwitchEvent) => onSwitchCallback(evt)"
                @afterSwitchTab="(evt: SwitchEvent) => onAfterSwitchTab(evt)"
            />
            <SimpleTab :tabGroup="`${gameId}-AlgTab`" tabName="QLearning">
                <ParamSelector
                    title="Parameters:"
                    :gameId="gameId"
                    settingsName="QLearning"
                    :settingsObject="qlSettings"
                    :accentColor="accentColor"
                    :selectionType="Enums.SelectionType.Grid"
                />
            </SimpleTab>
            <SimpleTab :tabGroup="`${gameId}-AlgTab`" tabName="MCLearning">
                <ParamSelector
                    title="Parameters:"
                    :gameId="gameId"
                    settingsName="MCLearning"
                    :settingsObject="mcSettings"
                    :accentColor="accentColor"
                    :selectionType="Enums.SelectionType.Grid"
                />
            </SimpleTab>
            <SimpleTab :tabGroup="`${gameId}-AlgTab`" tabName="DQN">
                <ParamSelector
                    title="Parameters:"
                    :gameId="gameId"
                    settingsName="DQN"
                    :settingsObject="dqnSettings"
                    :accentColor="accentColor"
                    :selectionType="Enums.SelectionType.Grid"
                />
            </SimpleTab>
        </SimpleTab>
        <SimpleTab tabGroup="trainingBenchmarkSwitch" tabName="Training">
            <div class="freeComponents">
                <Button
                    :handler="startTrainingHander"
                    value="Start Training"
                    :size="Enums.ButtonSize.Large"
                />
                <ParamSelector
                    :gameId="gameId"
                    settingsName="gameSettings"
                    :settingsObject="trainingSettings"
                    :selectionType="Enums.SelectionType.FreeStanding"
                />
            </div>
        </SimpleTab>
        <SimpleTab tabGroup="trainingBenchmarkSwitch" tabName="Benchmark">
            <SimpleTabSwitch
                :groupName="`${gameId}-AlgTab`"
                :customBtnOpenClasses="getTabStyleClass()"
                :on-before-switch="(evt: SwitchEvent) => onSwitchCallback(evt)"
                @afterSwitchTab="(evt: SwitchEvent) => onAfterSwitchTab(evt)"
            />
            <SimpleTab :tabGroup="`${gameId}-AlgTab`" tabName="QLearning">
            </SimpleTab>
            <SimpleTab :tabGroup="`${gameId}-AlgTab`" tabName="MCLearning">
            </SimpleTab>
            <SimpleTab :tabGroup="`${gameId}-AlgTab`" tabName="DQN">
            </SimpleTab>
            <div class="freeComponents">
                <Button
                    value="Start Benchmark"
                    :size="Enums.ButtonSize.Large"
                    :handler="startBenchmarkHandler"
                />
                <ParamSelector
                    :gameId="gameId"
                    settingsName="benchmarkSettings"
                    :settingsObject="benchmarkSettings"
                    :selectionType="Enums.SelectionType.FreeStanding"
                />
            </div>
        </SimpleTab>
        <SimpleTab
            tabGroup="trainingBenchmarkSwitch"
            :tabName="['Training', 'Benchmark']"
        >
            <div class="freeComponents">
                <AgentLoader
                    :gameId="gameId"
                    :env="env"
                    :agentObject="(<PersistableAgent<any, any>>agent)"
                    @loadNewAgent="onLoadNewAgent"
                    :activeAlgorithm="activeAlg"
                ></AgentLoader>
                <AgentSaver
                    :agentObject="(<PersistableAgent<any, any>>agent)"
                    :gameId="gameId"
                ></AgentSaver>
            </div>
        </SimpleTab>
        <SimpleTab tabGroup="trainingBenchmarkSwitch" tabName="Training">
            <div class="pb-2 pt-8">
                <GameTraining
                    :max-game-iteration="25"
                    :id="gameId"
                    ref="gameViewRef"
                    :agent="agent"
                    @passAgent="onPassAgent"
                    @initializeScene="updateSceneInfo"
                    :renderBetweenMoves="renderBetweenMoves"
                ></GameTraining>
            </div>
        </SimpleTab>
        <SimpleTab tabGroup="trainingBenchmarkSwitch" tabName="Benchmark">
            <div class="pb-2 pt-8">
                <GameBenchmark
                    :id="gameId"
                    :agent="agent"
                    ref="benchmarkViewRef"
                    :max-game-iteration="50"
                    @initializeScene="updateSceneInfo"
                    :renderBetweenMoves="renderBetweenMoves"
                ></GameBenchmark>
            </div>
        </SimpleTab>
        <SimpleTab tabGroup="trainingBenchmarkSwitch" tabName="Description">
            <Description v-if="contentPath" :path="contentPath"></Description>
        </SimpleTab>
        <Alert
            v-if="isAlertOpen"
            content="The currently loaded models will be deleted. Do you still want to continue"
            :on-success="onSuccess"
            :on-abort="onAbort"
        ></Alert>
    </div>
</template>
<script lang="ts" setup>
import {
    qlSettings,
    mcSettings,
    dqnSettings,
    benchmarkSettings,
    trainingSettings,
} from '~~/utils/settingsStructure';
import { Enums } from '~~/types';
import { Ref } from 'vue';
import { Agent, SingleAgentEnvironment, PersistableAgent } from 'quickrl.core';
import useSettingsStore from '~~/comsosable/useSettingsStore';
import {
    SwitchEvent,
    useSimpleTabsStore,
    SimpleTabStore,
    SimpleTab,
} from 'simple-tabs-vue';
import Description from './Description.vue';

const gameViewRef: Ref = ref();
const benchmarkViewRef: Ref = ref();

const tabsStore: SimpleTabStore = useSimpleTabsStore();

const settingsStore = useSettingsStore();

let env: Ref<SingleAgentEnvironment | undefined> = ref(undefined);

export interface GameProps {
    gameId: string;
    contentPath?: string;
    accentColor?: Enums.IconColor;
    renderBetweenMoves?: number;
}
const props = withDefaults(defineProps<GameProps>(), {
    renderBetweenMoves: 100,
});
//const props = defineProps<GameProps>();

let activeAlg: Ref<string> = getActiveAlgorithm();

onMounted(() => {
    tabsStore.switchTab(`${props.gameId}-AlgTab`, activeAlg.value);
});

function getActiveAlgorithm(): Ref<string> {
    const activeAlg = settingsStore.getActiveAlgorithm(props.gameId);
    if (activeAlg === 'random') {
        settingsStore.setActiveAlgorithm(props.gameId, 'QLearning');
    }
    return ref(activeAlg);
}

function getTabStyleClass(): string[] {
    if (props.accentColor) {
        return [
            `bg-${props.accentColor}-700`,
            `hover:bg-${props.accentColor}-700`,
        ];
    }
    return [];
}

let agent: Ref<Agent | undefined> = ref(undefined);

agent.value = undefined;

let isAlertOpen = ref(false);

function updateSceneInfo(trainingEnv: SingleAgentEnvironment) {
    env.value = trainingEnv;
}

function startTrainingHander() {
    gameViewRef.value.initializeTraining();
}

function startBenchmarkHandler() {
    benchmarkViewRef.value.initializeBenchmark();
}

function onPassAgent(passedAgent: any) {
    agent.value = passedAgent;
    console.log('agent passed', agent.value);
}

function onLoadNewAgent(loadedAgent: Agent | undefined) {
    agent.value = loadedAgent;
    console.log('loadedAgent', agent.value);
}

let lastSwitchEvent: SwitchEvent;

function onSwitchCallback(switchEvent: SwitchEvent): boolean {
    console.log(switchEvent);
    lastSwitchEvent = switchEvent;
    if (agent.value !== undefined) {
        isAlertOpen.value = true;
        return false;
    }
    return true;
}

function onAbort() {
    isAlertOpen.value = false;
    console.log('on abort', agent.value);
}

function onSuccess() {
    switchTab(lastSwitchEvent);
    isAlertOpen.value = false;
}

function onAfterSwitchTab(evt: SwitchEvent) {
    console.log('after', evt);
    if (evt.isSuccessful) {
        switchTab(evt);
    }
}

function switchTab(evt: SwitchEvent) {
    agent.value = undefined;
    console.log(evt.newTab[0]);
    settingsStore.setActiveAlgorithm(props.gameId, lastSwitchEvent.newTab[0]);
    activeAlg.value = lastSwitchEvent.newTab[0];
    tabsStore.switchTab(`${props.gameId}-AlgTab`, lastSwitchEvent.newTab[0]);
}
</script>

<style lang="postcss" scoped>
.freeComponents {
    @apply mt-8 flex flex-wrap gap-8;
}
</style>
~/utils/settingsInterfaces/algorithms/DQNSettings
~/utils/settingsInterfaces/algorithms/MCSettings
~/utils/settingsInterfaces/algorithms/QLSettings~/utils/defaultSettings/algorithms/MCSettings~/utils/defaultSettings/algorithms/DQNSettings~/utils/defaultSettings/trainingSettings~/utils/defaultSettings/benchmarkSettings
