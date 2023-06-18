<template>
    <div
        :class="[`buttonContainer`, size, { buttonDisabled: disabled }]"
        @click="clickHandler"
    >
        {{ value }}
    </div>
</template>

<script lang="ts" setup>
import { ButtonSize } from '~~/utils/enums';

export interface ButtonProps {
    handler?: () => any;
    value?: string;
    size: ButtonSize;
    disabled?: boolean;
}

const props = withDefaults(defineProps<ButtonProps>(), {
    size: ButtonSize.Normal,
});

function clickHandler() {
    if (props.handler) props.handler();
}
</script>

<style lang="postcss" scoped>
.buttonContainer {
    @apply flex cursor-pointer place-items-center rounded-md bg-darkPurple-700 py-2 px-4 text-base drop-shadow duration-300 hover:bg-darkPurple-600;
}

.btn-large {
    @apply py-3 px-6 text-lg;
}

.btn-small {
    @apply py-1 px-2 text-sm;
}

.buttonDisabled {
    @apply cursor-default opacity-40 hover:bg-darkPurple-700;
}
</style>
