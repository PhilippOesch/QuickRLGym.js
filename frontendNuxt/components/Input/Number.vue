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
            @change="(event) => finishEdit(event.target as HTMLInputElement)"
            @input="(event) => update(event.target as HTMLInputElement)"
            :step="stepSize"
            :disabled="disabled"
        />
    </div>
</template>
<script setup lang="ts">
import { defineProps, PropType, defineEmits, Ref } from 'vue';
import { InputStyleType } from '~~/utils/enums';

const props = defineProps({
    name: String,
    title: String,
    min: Number,
    max: Number,
    defaultValue: Number,
    styleClasses: String,
    disabled: Boolean,
    stepSize: Number,
    inputStyle: {
        type: Object as PropType<InputStyleType>,
        default: InputStyleType.Dark,
    },
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
    @apply w-full py-1 px-2 rounded-md mt-2 disabled:opacity-40;
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
