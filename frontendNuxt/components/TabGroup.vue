<template>
    <div>
        <div class="tabSelectContainer">
            <div class="tab selected">Q Learning</div>
            <div class="tab">Monte Carlo</div>
            <div class="tab">DQN</div>
        </div>
        <div class="tabContainer">
            <ParamSelection></ParamSelection>
        </div>
        <div class="freeComponents">
            <Button
                value="Start Training"
                :handler="btnHandler"
                :size="ButtonSize.Large"
            />
            <NumberInput
                title="Training Iterations"
                :min="1"
                defaultValue="1000"
                styleClasses="w-60"
                :inputStyle="InputStyleType.Light"
            ></NumberInput>
            <NumberInput
                title="Show Progress Every"
                :min="1"
                :max="200"
                defaultValue="100"
                styleClasses="w-60"
                :inputStyle="InputStyleType.Light"
            ></NumberInput>
            <NumberInput
                title="Random Seed"
                :min="1"
                :max="200"
                defaultValue="100"
                styleClasses="w-60"
                :inputStyle="InputStyleType.Light"
            ></NumberInput>
        </div>
        <ClientOnly fallback-tag="span" fallback="Loading Game...">
            <div class="mt-8"><Game></Game></div>
        </ClientOnly>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import ButtonSize from '../utils/enums/ButtonSize';
import InputStyleType from '../utils/enums/InputStyleType';

export default defineComponent({
    setup() {
        return { ButtonSize, InputStyleType };
    },
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
    @apply flex flex-wrap mt-8 gap-8;
}
</style>
