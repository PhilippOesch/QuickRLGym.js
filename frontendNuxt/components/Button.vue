<template>
    <div :class="`buttonContainer ${size}`" @click="clickHandler">
        {{ value }}
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import ButtonSize from '../utils/enums/ButtonSize';

export default defineComponent({
    props: {
        handler: Function,
        value: String,
        size: {
            type: Object as PropType<ButtonSize>,
            default: ButtonSize.Normal,
        },
    },
    setup() {
        return {};
    },
    methods: {
        clickHandler() {
            if (this.handler) this.handler();
        },
    },
});
</script>

<style lang="postcss" scoped>
.buttonContainer {
    @apply py-2 px-4 bg-slate-700 flex place-items-center text-base rounded-md drop-shadow hover:bg-slate-600 duration-300 cursor-pointer;
}

.btn-large {
    @apply py-3 px-6 text-lg;
}

.btn-small {
    @apply py-1 px-2 text-sm;
}
</style>
