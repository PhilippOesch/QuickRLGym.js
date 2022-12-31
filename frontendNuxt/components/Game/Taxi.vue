<template>
    <div>
        <TabGroup :tabs="['Q Learning', 'Monte Carlo']" groupName="taxiAlgTab">
            <Tab tabGroup="taxiAlgTab" name="Q Learning">
                <ParamSelector
                    gameID="Taxi"
                    algorithmName="QLearning"
                    :settingsObject="qlSettingsDefault"
                />
            </Tab>
            <Tab tabGroup="taxiAlgTab" name="Monte Carlo">
                <ParamSelector
                    gameID="Taxi"
                    algorithmName="Monte Carlo"
                    :settingsObject="mcSettingsDefault"
                />
            </Tab>
            <div class="freeComponents">
                <Button
                    value="Start Training"
                    :handler="btnHandler"
                    :size="ButtonSize.Large"
                />
                <NumberInput
                    title="Training Iterations"
                    :min="1"
                    :defaultValue="1000"
                    styleClasses="w-60"
                    :inputStyle="InputStyleType.Light"
                ></NumberInput>
                <NumberInput
                    title="Show Progress Every"
                    :min="1"
                    :max="200"
                    :defaultValue="100"
                    styleClasses="w-60"
                    :inputStyle="InputStyleType.Light"
                ></NumberInput>
                <NumberInput
                    title="Random Seed"
                    :min="1"
                    :max="200"
                    :defaultValue="100"
                    styleClasses="w-60"
                    :inputStyle="InputStyleType.Light"
                ></NumberInput>
            </div>
            <ClientOnly fallback-tag="span" fallback="Loading Game...">
                <div class="mt-8"><GameView></GameView></div>
            </ClientOnly>
        </TabGroup>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ButtonSize from '~~/utils/enums/ButtonSize';
import { qlSettingsDefault } from '~~/utils/settingsInterfaces/QLSettings';
import { mcSettingsDefault } from '~~/utils/settingsInterfaces/MCSettings';
import InputStyleType from '~~/utils/enums/InputStyleType';

export default defineComponent({
    setup() {
        return {
            qlSettingsDefault,
            InputStyleType,
            ButtonSize,
            mcSettingsDefault,
        };
    },
    mounted() {},
    methods: {
        btnHandler() {
            console.log('hallo');
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
    @apply flex flex-wrap mt-12 gap-8;
}
</style>
