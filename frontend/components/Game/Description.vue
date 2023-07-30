<template>
    <div class="gameDescriptionContainer">
        <ContentDoc :path="path"></ContentDoc>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
    path: string;
}>();
</script>
<style lang="postcss" scoped>
.gameDescriptionContainer {
    @apply card;
}

.gameDescriptionContainer :deep(h1) {
    @apply my-4 text-gray-50;
}

.gameDescriptionContainer :deep(p a) {
    @apply text-purple-400 hover:text-purple-500 visited:bg-slate-500;
}

:deep(p) {
    @apply mt-2 mb-4;
}

:deep(h2) {
    @apply text-2xl mb-1 mt-8 font-semibold first:mt-3;
}

:deep(h3) {
    @apply text-xl mb-1 mt-5 font-medium;
}

:deep(ul) {
    @apply list-disc pl-4 my-4;
}

:deep(table) {
    @apply my-4 border-collapse border-slate-500 border-solid border-2;
}

:deep(td) {
    @apply border-slate-500 border-solid border-2 py-1 px-4;
}
:deep(th) {
    @apply border-slate-500 border-solid border-2 py-1 px-4;
}

:deep(code) {
    @apply text-amber-400;
}
</style>
