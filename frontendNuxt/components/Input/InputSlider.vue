<template>
    <div class="sliderWrapper">
        <h3 class="title">{{ title }}</h3>
        <div class="sliderContainer">
            <input
                class="sliderInput"
                :class="accentColor"
                type="range"
                :name="name"
                :id="name"
                :max="max"
                :min="min"
                :value="valueRef"
                @change="(event)=> finishEdit(event.target as HTMLInputElement)"
                @input="(event) => update(event.target as HTMLInputElement)"
                :step="stepSize"
                :disabled="disabled"
            />
            <input
                type="number"
                class="sliderNumInput"
                :id="name + '-input'"
                :value="valueRef"
                :max="max"
                :min="min"
                @change="(event)=> finishEdit(event.target as HTMLInputElement)"
                @input="(event) => update(event.target as HTMLInputElement)"
                :step="stepSize"
                :disabled="disabled"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, PropType, Ref } from 'vue';
import { IconColor } from '~~/utils/enums';

const props = defineProps({
    name: String,
    title: String,
    max: Number,
    min: Number,
    defaultValue: Number,
    stepSize: Number,
    disabled: Boolean,
    accentColor: Object as PropType<IconColor>,
});

const valueRef: Ref<number> = ref(props.defaultValue ? props.defaultValue : 0);

const emit = defineEmits(['updated']);

function finishEdit(el: HTMLInputElement): void {
    if (props.min !== undefined && Number(el.value) < props.min)
        valueRef.value = props.min;
    if (props.max !== undefined && Number(el.value) > props.max)
        valueRef.value = props.max;
    emit('updated', valueRef.value);
}

function update(el: HTMLInputElement): void {
    valueRef.value = Number(el.value);
}
</script>

<style lang="postcss" scoped>
.sliderWrapper {
    @apply w-full col-span-2;
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
    @apply h-4 rounded-full bg-darkPurple-600 disabled:opacity-40;
}

.sliderInput::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    @apply rounded-full w-7 h-7 border disabled:opacity-40;
    cursor: pointer;
}

.amber.sliderInput::-webkit-slider-thumb {
    @apply bg-amber-400;
}

.amber.sliderInput::-moz-range-thumb {
    @apply bg-amber-400;
}

.green.sliderInput::-webkit-slider-thumb {
    @apply bg-green-400;
}

.green.sliderInput::-moz-range-thumb {
    @apply bg-green-400;
}

.sky.sliderInput::-webkit-slider-thumb {
    @apply bg-sky-400;
}

.sky.sliderInput::-moz-range-thumb {
    @apply bg-sky-400;
}

.pink.sliderInput::-webkit-slider-thumb {
    @apply bg-pink-400;
}

.pink.sliderInput::-moz-range-thumb {
    @apply bg-pink-400;
}

.sliderInput::-moz-range-thumb {
    @apply rounded-full w-7 h-7 disabled:opacity-40;
    cursor: pointer;
}

.sliderNumInput {
    @apply w-28 ml-4 bg-darkPurple-900 py-1 px-2 rounded-md disabled:opacity-40;
}

.sliderWrapper .sliderContainer {
    @apply flex mt-2 place-content-center place-items-center disabled:opacity-40;
}

.sliderWrapper .sliderContainer p {
    @apply bg-darkPurple-900;
}
</style>
