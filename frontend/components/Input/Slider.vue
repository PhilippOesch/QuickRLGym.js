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
                @change="(event) => finishEdit(<HTMLInputElement>event.target)"
                @input="(event) => update(<HTMLInputElement>event.target)"
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
                @change="(event)=> finishEdit(<HTMLInputElement>event.target)"
                @input="(event) => update(<HTMLInputElement>event.target)"
                :step="stepSize"
                :disabled="disabled"
            />
        </div>
    </div>
</template>

<script setup lang="ts">
import { type BaseInputProps } from '~/types/PropTypes';
import { Enums } from '~~/types';

export type InputSliderProps = BaseInputProps& {
    max?: number;
    min?: number;
    defaultValue?: number;
    stepSize?: number;
    accentColor?: Enums.IconColor;
}

const props = defineProps<InputSliderProps>();

const valueRef = ref(props.defaultValue ? props.defaultValue : 0);

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
    @apply col-span-2 w-full;
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
    @apply h-7 w-7 rounded-full border disabled:opacity-40;
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
    @apply h-7 w-7 rounded-full disabled:opacity-40;
    cursor: pointer;
}

.sliderNumInput {
    @apply ml-4 w-28 rounded-md bg-darkPurple-900 py-1 px-2 disabled:opacity-40;
}

.sliderWrapper .sliderContainer {
    @apply mt-2 flex place-content-center place-items-center disabled:opacity-40;
}

.sliderWrapper .sliderContainer p {
    @apply bg-darkPurple-900;
}
</style>
~/types/PropTypes
