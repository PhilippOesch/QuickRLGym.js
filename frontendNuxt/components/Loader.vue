<template>
    <div class="loadingElement">
        <div class="loadingContentWrapper">{{ text }}</div>
    </div>
</template>

<script lang="ts" setup>
defineProps({
    text: {
        type: String,
        default: 'Loading',
    },
});
</script>

<style lang="postcss" scoped>
.loadingElement {
    @apply absolute h-full w-full bg-darkPurple-900 bg-opacity-50 text-lg;
}

.loadingContentWrapper {
    @apply mb-2 flex h-full w-full place-content-center place-items-center;
}
</style>
