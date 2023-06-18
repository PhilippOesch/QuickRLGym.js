<template>
    <div class="toggleContainer">
        <h3 class="title">{{ title }}</h3>
        <label class="switch" :class="[accentColor]">
            <input
                type="checkbox"
                :checked="value"
                @change="finishEdit"
                ref="checkBoxRef"
                :disabled="disabled"
                :name="name"
            />
            <span class="slider round"></span>
        </label>
    </div>
</template>

<script setup lang="ts">
import { BaseInputProps } from '~/utils/PropTypes';
import { IconColor } from '~~/utils/enums';

export interface InputToggleProps extends BaseInputProps {
    defaultValue?: boolean;
    accentColor?: IconColor;
}
const props = defineProps<InputToggleProps>();

let value = props.defaultValue ? props.defaultValue : false;

const emit = defineEmits(['updated']);

function finishEdit(): void {
    value = !value;
    emit('updated', value);
}
</script>

<style lang="postcss" scoped>
.toggleContainer {
    @apply w-full flex place-items-center gap-3 col-span-2;
}

.toggleContainer .title {
    @apply text-lg;
}

.switch {
    @apply w-16 h-9 inline-block relative;
}

/* Hide default HTML checkbox */
.switch input {
    @apply hidden;
}

/* The slider */
.slider {
    @apply bg-darkPurple-700 absolute cursor-pointer top-0 left-0 right-0 bottom-0 duration-300;
}

.slider:before {
    content: '';
    @apply absolute left-1 bottom-1 h-7 w-7 bg-gray-50 duration-300;
}

input:disabled + .slider {
    @apply opacity-40;
}

.green input:checked + .slider {
    @apply bg-green-600;
}

.green input:focus + .slider {
    @apply shadow-green-600;
}

.amber input:checked + .slider {
    @apply bg-amber-600;
}

.amber input:focus + .slider {
    @apply shadow-amber-600;
}

.sky input:checked + .slider {
    @apply bg-sky-600;
}

.sky input:focus + .slider {
    @apply shadow-sky-600;
}

.sky input:checked + .slider {
    @apply bg-pink-600;
}

.sky input:focus + .slider {
    @apply shadow-pink-600;
}

input:checked + .slider:before {
    @apply translate-x-7;
}

/* Rounded sliders */
.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}
</style>
