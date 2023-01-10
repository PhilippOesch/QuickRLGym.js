<template>
    <div class="loadingElement">
        <div class="loadingContentWrapper">{{ text }}</div>
    </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

defineProps({
    text: {
        type: String,
        default: 'Loading',
    },
});
</script>

<style lang="postcss" scoped>
.loadingElement {
    @apply text-lg absolute w-full h-full bg-slate-900 bg-opacity-50;
}

.loadingContentWrapper {
    @apply w-full h-full flex place-content-center place-items-center mb-2;
}
</style>
