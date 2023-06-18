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
                    :settingsObject="qlSettingsDefault"
                    :accentColor="accentColor"
                    :selectionType="SelectionType.Grid"
                />
            </SimpleTab>
            <SimpleTab :tabGroup="`${gameId}-AlgTab`" tabName="MCLearning">
                <ParamSelector
                    title="Parameters:"
                    :gameId="gameId"
                    settingsName="MCLearning"
                    :settingsObject="mcSettingsDefault"
                    :accentColor="accentColor"
                    :selectionType="SelectionType.Grid"
                />
            </SimpleTab>
            <SimpleTab :tabGroup="`${gameId}-AlgTab`" tabName="DQN">
                <ParamSelector
                    title="Parameters:"
                    :gameId="gameId"
                    settingsName="DQN"
                    :settingsObject="dqnSettingsDefault"
                    :accentColor="accentColor"
                    :selectionType="SelectionType.Grid"
                />
            </SimpleTab>
        </SimpleTab>
        <SimpleTab tabGroup="trainingBenchmarkSwitch" tabName="Training">
            <div class="freeComponents">
                <Button
                    :handler="startTrainingHander"
                    value="Start Training"
                    :size="ButtonSize.Large"
                />
                <ParamSelector
                    :gameId="gameId"
                    settingsName="gameSettings"
                    :settingsObject="defaultTrainingSettings"
                    :selectionType="SelectionType.FreeStanding"
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
                    :size="ButtonSize.Large"
                    :handler="startBenchmarkHandler"
                />
                <ParamSelector
                    :gameId="gameId"
                    settingsName="benchmarkSettings"
                    :settingsObject="defaultBenchmarkSettings"
                    :selectionType="SelectionType.FreeStanding"
                />
            </div>
        </SimpleTab>
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
        <SimpleTab tabGroup="trainingBenchmarkSwitch" tabName="Training">
            <div class="pb-2 pt-8">
                <GameTraining
                    :max-game-iteration="25"
                    :id="gameId"
                    ref="gameViewRef"
                    :agent="agent"
                    @passAgent="onPassAgent"
                    @initializeScene="updateSceneInfo"
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
                ></GameBenchmark>
            </div>
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
import { qlSettingsDefault } from '~~/utils/settingsInterfaces/QLSettings';
import { mcSettingsDefault } from '~~/utils/settingsInterfaces/MCSettings';
import { dqnSettingsDefault } from '~~/utils/settingsInterfaces/DQNSettings';
import defaultTrainingSettings from '~~/utils/settingsInterfaces/trainingSettings';
import { SelectionType, ButtonSize, IconColor } from '~~/utils/enums';
import { PropType, Ref } from 'vue';
import { Agent, SingleAgentEnvironment, PersistableAgent } from 'quickrl.core';
import defaultBenchmarkSettings from '~~/utils/settingsInterfaces/benchmarkSettings';
import useSettingsStore from '~~/comsosable/useSettingsStore';
import {
    SwitchEvent,
    useSimpleTabsStore,
    SimpleTabStore,
} from 'simple-tabs-vue';

const gameViewRef: Ref = ref();
const benchmarkViewRef: Ref = ref();

const tabsStore: SimpleTabStore = useSimpleTabsStore();

const settingsStore = useSettingsStore();

let env: Ref<SingleAgentEnvironment | undefined> = ref(undefined);

export interface GameProps {
    gameId: string;
    accentColor?: IconColor;
}
const props = defineProps<GameProps>();

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
