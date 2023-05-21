<template>
    <div>
        <TabGroup
            class="mt-12"
            groupName="trainingBenchmarkSwitch"
            :accentColor="accentColor"
        />
        <Tab tabGroup="trainingBenchmarkSwitch" name="Training">
            <TabGroup
                :groupName="`${gameId}-AlgTab`"
                :accentColor="accentColor"
            />
            <Tab
                :tabGroup="`${gameId}-AlgTab`"
                name="QLearning"
                :onLeaveHandler="() => beforeSwitchTab()"
                @tabSwitching="(newTab: string, prevTab: string) => onSwitchTab(newTab, prevTab)"
            >
                <ParamSelector
                    title="Parameters:"
                    :gameId="gameId"
                    settingsName="QLearning"
                    :settingsObject="qlSettingsDefault"
                    :accentColor="accentColor"
                    :selectionType="SelectionType.Grid"
                />
            </Tab>
            <Tab
                :tabGroup="`${gameId}-AlgTab`"
                name="MCLearning"
                :onLeaveHandler="() => beforeSwitchTab()"
                @tabSwitching="(prevTab: string, newTab: string) => onSwitchTab(prevTab, newTab)"
            >
                <ParamSelector
                    title="Parameters:"
                    :gameId="gameId"
                    settingsName="MCLearning"
                    :settingsObject="mcSettingsDefault"
                    :accentColor="accentColor"
                    :selectionType="SelectionType.Grid"
                />
            </Tab>
            <Tab
                :tabGroup="`${gameId}-AlgTab`"
                name="DQN"
                :onLeaveHandler="() => beforeSwitchTab()"
                @tabSwitching="(prevTab: string, newTab: string) => onSwitchTab(prevTab, newTab)"
            >
                <ParamSelector
                    title="Parameters:"
                    :gameId="gameId"
                    settingsName="DQN"
                    :settingsObject="dqnSettingsDefault"
                    :accentColor="accentColor"
                    :selectionType="SelectionType.Grid"
                />
            </Tab>
        </Tab>
        <Tab tabGroup="trainingBenchmarkSwitch" name="Training">
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
        </Tab>
        <Tab tabGroup="trainingBenchmarkSwitch" name="Benchmark">
            <TabGroup
                :groupName="`${gameId}-AlgTab`"
                :accentColor="accentColor"
            />
            <Tab
                :tabGroup="`${gameId}-AlgTab`"
                name="QLearning"
                :onLeaveHandler="() => beforeSwitchTab()"
                @tabSwitching="(prevTab: string, newTab: string) => onSwitchTab(prevTab, newTab)"
            >
            </Tab>
            <Tab
                :tabGroup="`${gameId}-AlgTab`"
                name="MCLearning"
                :onLeaveHandler="() => beforeSwitchTab()"
                @tabSwitching="(prevTab: string, newTab: string) => onSwitchTab(prevTab, newTab)"
            >
            </Tab>
            <Tab
                :tabGroup="`${gameId}-AlgTab`"
                name="DQN"
                :onLeaveHandler="() => beforeSwitchTab()"
                @tabSwitching="(prevTab: string, newTab: string) => onSwitchTab(prevTab, newTab)"
            >
            </Tab>
            <div class="freeComponents">
                <Button value="Start Benchmark" :size="ButtonSize.Large" />
                <ParamSelector
                    :gameId="gameId"
                    settingsName="benchmarkSettings"
                    :settingsObject="defaultBenchmarkSettings"
                    :selectionType="SelectionType.FreeStanding"
                />
            </div>
        </Tab>
        <div class="freeComponents">
            <AgentLoader
                :gameId="gameId"
                :env="env"
                :agentObject="(<PersistableAgent>agent)"
                @loadNewAgent="onLoadNewAgent"
            ></AgentLoader>
            <Saver
                :agentObject="(<PersistableAgent>agent)"
                :gameId="gameId"
            ></Saver>
        </div>
        <div class="pb-2 pt-8">
            <GameView
                :training-iteration="25"
                :id="gameId"
                ref="gameViewRef"
                :agent="agent"
                @passAgent="onPassAgent"
                @initializeScene="updateSceneInfo"
            ></GameView>
        </div>
        <Alert
            v-if="isAlertOpen"
            content="The currently loaded models will be deleted. Do you still want to continue"
            :onSuccess="() => onSuccess()"
            :onAbort="() => onAbort()"
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
//import useTabStore from '~~/comsosable/useTabStore';
import defaultBenchmarkSettings from '~~/utils/settingsInterfaces/benchmarkSettings';
import useSettingsStore from '~~/comsosable/useSettingsStore';
import useTabStore from '~~/comsosable/useTabStore';

const gameViewRef: Ref = ref();

const settingsStore = useSettingsStore();

let env: Ref<SingleAgentEnvironment | undefined> = ref(undefined);
let refNewAlg: string;

const tabStore = useTabStore();

const props = defineProps({
    gameId: {
        type: String,
        required: true,
    },
    accentColor: String as PropType<IconColor>,
});

function onSwitchTab(newTab: string, prevTab: string) {
    refNewAlg = newTab;
    switchTab();
}

function beforeSwitchTab() {
    console.log('beforeTabSwitch', agent.value);
    if (agent.value !== undefined) {
        isAlertOpen.value = true;
        console.log('hallo, is noch was?');
        return false;
    }
    return true;
}

let agent: Ref<Agent | undefined> = ref(undefined);

settingsStore.setActiveAlgorithm(props.gameId, 'QLearning');
agent.value = undefined;

let isAlertOpen = ref(false);

function updateSceneInfo(trainingEnv: SingleAgentEnvironment) {
    env.value = trainingEnv;
}

function startTrainingHander() {
    gameViewRef.value.initializeTraining();
}

function onPassAgent(passedAgent: any) {
    agent.value = passedAgent;
    console.log(agent.value);
}

function onLoadNewAgent(loadedAgent: Agent | undefined) {
    agent.value = loadedAgent;
    console.log('loadedAgent', agent.value);
}

function onAbort() {
    isAlertOpen.value = false;
    console.log('on abort', agent.value);
}

function onSuccess() {
    switchTab();
    isAlertOpen.value = false;
}

function switchTab() {
    agent.value = undefined;
    console.log('actualSwitch', agent.value);
    console.log('newAlg', refNewAlg);
    settingsStore.setActiveAlgorithm(props.gameId, refNewAlg);
    tabStore.switchTab(props.gameId, refNewAlg);
    console.log('the new alg', refNewAlg);
}
</script>

<style lang="postcss" scoped>
.tabSelectContainer {
    @apply mt-6 flex max-w-fit gap-4 rounded-md bg-darkPurple-800 px-2 py-2 drop-shadow;
}

.tab {
    @apply cursor-pointer rounded-md px-6 py-3 duration-300 hover:bg-darkPurple-700;
}

.tabContainer {
    @apply mt-8;
}

.freeComponents {
    @apply mt-8 flex flex-wrap gap-8;
}
</style>
