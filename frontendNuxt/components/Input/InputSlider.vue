<template>
    <div class="sliderWrapper">
        <h3 class="title">{{ title }}</h3>
        <div class="sliderContainer">
            <input
                class="sliderInput"
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
import { defineProps, Ref } from 'vue';

const props = defineProps({
    name: String,
    title: String,
    max: Number,
    min: Number,
    defaultValue: Number,
    stepSize: Number,
    disabled: Boolean,
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
    @apply h-4 rounded-full bg-slate-600 disabled:opacity-40;
}

.sliderInput::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    @apply bg-sky-400 rounded-full w-7 h-7 border disabled:opacity-40;
    cursor: pointer;
}

.sliderInput::-moz-range-thumb {
    @apply bg-sky-400 rounded-full w-7 h-7 disabled:opacity-40;
    cursor: pointer;
}

.sliderNumInput {
    @apply w-28 ml-4 bg-slate-900 py-1 px-2 rounded-md disabled:opacity-40;
}

.sliderWrapper .sliderContainer {
    @apply flex mt-2 place-content-center place-items-center disabled:opacity-40;
}

.sliderWrapper .sliderContainer p {
    @apply bg-slate-900;
}
</style>
