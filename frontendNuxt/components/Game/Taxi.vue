<template>
    <div>
        <TabGroup
            :tabs="['Q Learning', 'Monte Carlo']"
            groupName="taxiAlgTab"
        />
        <Tab tabGroup="taxiAlgTab" name="Q Learning">
            <ParamSelector
                title="Parameters:"
                gameID="Taxi"
                algorithmName="QLearning"
                :settingsObject="qlSettingsDefault"
            />
        </Tab>
        <Tab tabGroup="taxiAlgTab" name="Monte Carlo">
            <ParamSelector
                title="Parameters:"
                gameID="Taxi"
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
                    gameID="Taxi"
                    algorithmName="gameSettings"
                    :settingsObject="defaultTrainingSettings"
                    :selectionType="SelectionType.FreeStanding"
                />
            </div>
        </Tab>
        <Tab tabGroup="trainingBenchmarkSwitch" name="Benchmark"></Tab>
        <div class="pt-8 pb-2">
            <GameView
                :training-iteration="25"
                id="Taxi"
                ref="gameViewRef"
            ></GameView>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { qlSettingsDefault } from '~~/utils/settingsInterfaces/QLSettings';
import { mcSettingsDefault } from '~~/utils/settingsInterfaces/MCSettings';
import defaultTrainingSettings from '~~/utils/settingsInterfaces/trainingSettings';
import { SelectionType, ButtonSize } from '~~/utils/enums';
import { Ref } from 'vue';

const gameViewRef: Ref<any> = ref(null);

function startTrainingHander() {
    console.log(gameViewRef.value.initializeTraining());
}
</script>

<style lang="postcss" scoped>
.tabSelectContainer {
    @apply bg-slate-800 px-2 py-2 rounded-md flex gap-4 drop-shadow mt-6 max-w-fit;
}

.tab {
    @apply px-6 py-3 hover:bg-slate-700 rounded-md duration-300 cursor-pointer;
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
