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
                name="Q Learning"
                :onEnterHandler="() => onEnterHandler('Q Learning')"
            >
                <ParamSelector
                    title="Parameters:"
                    :gameId="gameId"
                    settingsName="QLearning"
                    :settingsObject="qlSettingsDefault"
                    :accentColor="accentColor"
                />
            </Tab>
            <Tab
                :tabGroup="`${gameId}-AlgTab`"
                name="Monte Carlo"
                :onEnterHandler="() => onEnterHandler('Monte Carlo')"
            >
                <ParamSelector
                    title="Parameters:"
                    :gameId="gameId"
                    settingsName="MCLearning"
                    :settingsObject="mcSettingsDefault"
                    :accentColor="accentColor"
                />
            </Tab>
            <Tab :tabGroup="`${gameId}-AlgTab`" name="DQN">
                <ParamSelector
                    title="Parameters:"
                    :gameId="gameId"
                    settingsName="DQN"
                    :settingsObject="dqnSettingsDefault"
                    :accentColor="accentColor"
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
import useTabStore from '~~/comsosable/useTabStore';
import defaultBenchmarkSettings from '~~/utils/settingsInterfaces/benchmarkSettings';

const gameViewRef: Ref = ref();

let env: Ref<SingleAgentEnvironment | undefined> = ref(undefined);

const props = defineProps({
    gameId: {
        type: String,
        required: true,
    },
    accentColor: Object as PropType<IconColor>,
});

const { getOpenTab } = useTabStore();

function onEnterHandler(alg: string) {
    console.log(`${alg} is opened`);
}

function updateSceneInfo(trainingEnv: SingleAgentEnvironment) {
    env.value = trainingEnv;
}

function startTrainingHander() {
    gameViewRef.value.initializeTraining();
}

let agent: Ref<Agent | undefined> = ref(undefined);

function onPassAgent(passedAgent: any) {
    agent.value = passedAgent;
    console.log(agent.value);
}

function onLoadNewAgent(loadedAgent: any) {
    agent.value = loadedAgent;
    console.log('loadedAgent', agent.value);
}

watch(
    () => getOpenTab(`${props.gameId}-AlgTab`),
    () => {
        agent.value = undefined;
    }
);
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
