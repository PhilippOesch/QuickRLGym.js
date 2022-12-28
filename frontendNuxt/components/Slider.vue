<template>
    <div class="sliderWrapper">
        <h3 class="title">{{ title }}</h3>
        <div class="container">
            <input
                class="sliderInput"
                type="range"
                :name="name"
                :id="name"
                :value="currentValue"
                @input="(event) => update(event.target as HTMLInputElement)"
                :max="max"
                :min="min"
                :step="isfloat ? 0.01 : 1"
            />
            <input
                type="number"
                class="sliderNumInput"
                :id="name + '-input'"
                :value="currentValue"
                @input="(event) => update(event.target as HTMLInputElement)"
                :max="max"
                :min="min"
                :step="isfloat ? 0.01 : 1"
            />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        name: String,
        title: String,
        max: Number,
        min: Number,
        defaultValue: Number,
        isfloat: {
            type: Boolean,
            default: false,
        },
    },
    setup() {
        return {};
    },
    data() {
        return {
            currentValue: this.defaultValue,
        };
    },
    methods: {
        update(el: HTMLInputElement) {
            this.currentValue = el.value;
        },
    },
});
</script>

<style lang="postcss" scoped>
.sliderWrapper {
    @apply w-full;
}

.sliderWrapper .title {
    @apply text-lg;
}

.sliderInput {
    @apply w-full;
}

.sliderInput {
    -webkit-appearance: none; /* Override default look */
    appearance: none;
    @apply h-4 rounded-full bg-gray-600;
}

.sliderInput::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    @apply bg-sky-400 rounded-full w-7 h-7 border;
    cursor: pointer;
}

.sliderInput::-moz-range-thumb {
    @apply bg-sky-400 rounded-full w-7 h-7;
    cursor: pointer;
}

.sliderNumInput {
    @apply w-28 ml-4 bg-gray-900 py-1 px-2 rounded-md;
}

.sliderWrapper .container {
    @apply flex mt-2 place-content-center place-items-center;
}

.sliderWrapper .container p {
    @apply bg-gray-900;
}
</style>
