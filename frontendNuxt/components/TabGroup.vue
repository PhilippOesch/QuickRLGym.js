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
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        return {};
    },
});
</script>

<style lang="postcss" scoped>
.tabSelectContainer {
    @apply bg-gray-800 px-2 py-2 rounded-md flex gap-4 drop-shadow mt-6 max-w-fit;
}

.tab {
    @apply px-6 py-3 hover:bg-gray-700 rounded-md duration-300;
}

.selected {
    @apply bg-sky-600 hover:bg-sky-600;
}

.tabContainer {
    @apply mt-8;
}
</style>
