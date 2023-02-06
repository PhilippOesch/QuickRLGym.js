<template>
    <div :class="['numberInputContainer', styleClasses]">
        <h3 :class="title">{{ title }}</h3>
        <input
            type="text"
            v-model="value"
            :class="inputStyle"
            @change="() => finishEdit()"
            :disabled="disabled"
        />
    </div>
</template>

<script setup lang="ts">
import { InputStyleType } from '~~/utils/enums';
import { PropType } from 'vue';

const props = defineProps({
    name: String,
    min: Number,
    styleClasses: String,
    title: String,
    delimiter: {
        type: String,
        required: true,
    },
    inputStyle: {
        type: Object as PropType<InputStyleType>,
        default: InputStyleType.Dark,
    },
    defaultValue: {
        type: Object as PropType<number[]>,
    },
    disabled: Boolean,
});

const emit = defineEmits(['updated']);

const value = ref();

if (props.defaultValue) {
    value.value = props.defaultValue.join(props.delimiter);
}

let numArray = [];

function finishEdit(): void {
    const subArray: string[] = (<string>value.value).split(props.delimiter);
    numArray = [];
    for (let entry of subArray) {
        if (!isNaN(parseInt(entry))) numArray.push(parseInt(entry));
    }
    emit('updated', numArray);
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
