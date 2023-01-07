<template>
    <div>
        <TabGroup
            :tabs="['Q Learning', 'Monte Carlo']"
            groupName="blackJackAlgTab"
        />
        <Tab tabGroup="blackJackAlgTab" name="Q Learning">
            <ParamSelector
                title="Parameters:"
                gameID="BlackJack"
                algorithmName="QLearning"
                :settingsObject="qlSettingsDefault"
            />
        </Tab>
        <Tab tabGroup="blackJackAlgTab" name="Monte Carlo">
            <ParamSelector
                title="Parameters:"
                gameID="BlackJack"
                algorithmName="MCLearning"
                :settingsObject="mcSettingsDefault"
            />
        </Tab>
        <TabGroup
            class="mt-12"
            :tabs="['Training', 'Benchmark']"
            groupName="trainingBenchmarkSwitch"
        />
        <Tab tabGroup="trainingBenchmarkSwitch" name="Training">
            <div class="freeComponents">
                <Button
                    :handler="startTrainingHander"
                    value="Start Training"
                    :size="ButtonSize.Large"
                />
                <ParamSelector
                    gameID="BlackJack"
                    algorithmName="gameSettings"
                    :settingsObject="defaultTrainingSettings"
                    :selectionType="SelectionType.FreeStanding"
                />
            </div>
        </Tab>
        <Tab tabGroup="trainingBenchmarkSwitch" name="Benchmark">Benchmark</Tab>
        <div class="mt-8">
            <GameView
                :training-iteration="25"
                id="BlackJack"
                ref="gameView"
            ></GameView>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { qlSettingsDefault } from '~~/utils/settingsInterfaces/QLSettings';
import { mcSettingsDefault } from '~~/utils/settingsInterfaces/MCSettings';
import defaultTrainingSettings from '~~/utils/settingsInterfaces/trainingSettings';

export default defineComponent({
    setup() {
        return {
            qlSettingsDefault,
            mcSettingsDefault,
            defaultTrainingSettings,
        };
    },
    methods: {
        startTrainingHander() {
            (this.$refs.gameView as any).initializeTraining();
        },
    },
});
</script>

<style lang="postcss" scoped>
.tabSelectContainer {
    @apply bg-gray-800 px-2 py-2 rounded-md flex gap-4 drop-shadow mt-6 max-w-fit;
}

.tab {
    @apply px-6 py-3 hover:bg-gray-700 rounded-md duration-300 cursor-pointer;
}

.selected {
    @apply bg-sky-600 hover:bg-sky-600;
}

.tabContainer {
    @apply mt-8;
}

.freeComponents {
    @apply flex flex-wrap mt-8 gap-8;
}
</style>
