<template>
    <div class="tabContainer">
        <h3>Parameters:</h3>
        <div class="settingsContainer">
            <Slider
                title="Parameter 1"
                :max="200"
                :min="0"
                :defaultValue="50"
            ></Slider>
            <Slider
                title="Parameter 2"
                :max="1"
                :min="0"
                :defaultValue="0.5"
                :isfloat="true"
            ></Slider>
            <Slider
                title="Parameter 3"
                :max="200"
                :min="0"
                :defaultValue="50"
            ></Slider>
            <Slider
                title="Parameter 4"
                :max="200"
                :min="0"
                :defaultValue="50"
            ></Slider>
            <Slider
                title="Parameter 5"
                :max="200"
                :min="0"
                :defaultValue="50"
            ></Slider>
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
.tabContainer {
    @apply drop-shadow bg-slate-800 rounded-md px-4 py-3;
}

h3 {
    @apply text-2xl;
}

.settingsContainer {
    @apply grid lg:grid-cols-3 gap-8 mt-6;
}
</style>
