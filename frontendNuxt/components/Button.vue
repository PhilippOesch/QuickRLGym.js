<template>
    <div
        :class="[`buttonContainer`, size, { buttonDisabled: disabled }]"
        @click="clickHandler"
    >
        {{ value }}
    </div>
</template>

<script lang="ts" setup>
import { defineProps, PropType } from 'vue';
import { ButtonSize } from '~~/utils/enums';

const props = defineProps({
    handler: Function,
    value: String,
    size: {
        type: Object as PropType<ButtonSize>,
        default: ButtonSize.Normal,
    },
    disabled: Boolean,
});

function clickHandler() {
    if (props.handler) props.handler();
}
</script>

<style lang="postcss" scoped>
.buttonContainer {
    @apply py-2 px-4 bg-darkPurple-700 flex place-items-center text-base rounded-md drop-shadow hover:bg-darkPurple-600 duration-300 cursor-pointer;
}

.btn-large {
    @apply py-3 px-6 text-lg;
}

.btn-small {
    @apply py-1 px-2 text-sm;
}

.buttonDisabled {
    @apply opacity-40 cursor-default hover:bg-darkPurple-700;
}
</style>
