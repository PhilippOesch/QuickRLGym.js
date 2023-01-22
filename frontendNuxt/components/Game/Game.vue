<template>
    <div>
        <TabGroup
            :tabs="['Q Learning', 'Monte Carlo', 'DQN']"
            :groupName="`${gameId}-AlgTab`"
            :accentColor="accentColor"
        />
        <Tab :tabGroup="`${gameId}-AlgTab`" name="Q Learning">
            <ParamSelector
                title="Parameters:"
                :gameID="gameId"
                algorithmName="QLearning"
                :settingsObject="qlSettingsDefault"
                :accentColor="accentColor"
            />
        </Tab>
        <Tab :tabGroup="`${gameId}-AlgTab`" name="Monte Carlo">
            <ParamSelector
                title="Parameters:"
                :gameID="gameId"
                algorithmName="MCLearning"
                :settingsObject="mcSettingsDefault"
                :accentColor="accentColor"
            />
        </Tab>
        <Tab :tabGroup="`${gameId}-AlgTab`" name="DQN">
            <ParamSelector
                title="Parameters:"
                :gameID="gameId"
                algorithmName="DQN"
                :settingsObject="dqnSettingsDefault"
                :accentColor="accentColor"
            />
        </Tab>
        <TabGroup
            class="mt-12"
            :tabs="['Training', 'Benchmark']"
            groupName="trainingBenchmarkSwitch"
            :accentColor="accentColor"
        />
        <Tab tabGroup="trainingBenchmarkSwitch" name="Training">
            <div class="freeComponents">
                <Button
                    :handler="startTrainingHander"
                    value="Start Training"
                    :size="ButtonSize.Large"
                />
                <ParamSelector
                    :gameID="gameId"
                    algorithmName="gameSettings"
                    :settingsObject="defaultTrainingSettings"
                    :selectionType="SelectionType.FreeStanding"
                />
                <FileLoader :agentObject="agent"></FileLoader>
                <Saver :agentObject="agent"></Saver>
            </div>
        </Tab>
        <Tab tabGroup="trainingBenchmarkSwitch" name="Benchmark"></Tab>
        <div class="pt-8 pb-2">
            <GameView
                :training-iteration="25"
                :id="gameId"
                ref="gameViewRef"
                @passAgent="updateAgent"
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
import { TrainableAgent } from 'quickrl.core';

const gameViewRef: Ref<any> = ref(null);

defineProps({
    gameId: {
        type: String,
        required: true,
    },
    accentColor: Object as PropType<IconColor>,
});

function startTrainingHander() {
    gameViewRef.value.initializeTraining();
}

let agent: TrainableAgent;

function updateAgent(passedAgent: TrainableAgent) {
    agent = passedAgent;
    console.log(agent);
}
</script>

<style lang="postcss" scoped>
.tabSelectContainer {
    @apply bg-darkPurple-800 px-2 py-2 rounded-md flex gap-4 drop-shadow mt-6 max-w-fit;
}

.tab {
    @apply px-6 py-3 hover:bg-darkPurple-700 rounded-md duration-300 cursor-pointer;
}

.tabContainer {
    @apply mt-8;
}

.freeComponents {
    @apply flex flex-wrap mt-8 gap-8;
}
</style>
