<template>
    <div :class="['numberInputContainer', styleClasses]">
        <h3 :class="title">{{ title }}</h3>
        <input
            type="number"
            :name="name"
            :max="max"
            :min="min"
            :value="valueRef"
            :class="inputStyle"
            @change="(event) => finishEdit(<HTMLInputElement>event.target)"
            @input="(event) => update(<HTMLInputElement>event.target)"
            :step="stepSize"
            :disabled="disabled"
        />
    </div>
</template>
<script setup lang="ts">
import { Ref } from 'vue';
import { BaseInputProps } from '~/utils/PropTypes';
import { InputStyleType } from '~~/utils/enums';

export interface NumberInputProps extends BaseInputProps {
    min?: number;
    max?: number;
    defaultValue?: number;
    stepSize?: number;
}

const props = withDefaults(defineProps<NumberInputProps>(), {
    inputStyle: InputStyleType.Dark,
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
.numberInputContainer input {
    @apply mt-2 w-full rounded-md py-1 px-2 disabled:opacity-40;
}

.numberInputContainer h3 {
    @apply text-lg;
}

.numberInputContainer {
    @apply col-span-2;
}

.inputDark {
    @apply bg-darkPurple-900;
}

.inputLight {
    @apply bg-darkPurple-700;
}
</style>
