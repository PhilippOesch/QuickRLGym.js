<template>
    <div :class="['infoBox', 'gameInfo', styleClasses ? styleClasses : '']">
        <h2>{{ props.title }}</h2>
        <ul class="list" v-if="props.content">
            <li class="flex gap-2" v-for="(item, index) in props.content">
                <span>{{ index }}:</span><span>{{ item }}</span>
            </li>
        </ul>
    </div>
</template>

<script setup lang="ts">
interface InfoBoxProps {
    title: string;
    content?: object;
    styleClasses?: string;
}

const props = defineProps<InfoBoxProps>();
</script>
<style lang="postcss" scoped>
.infoBox {
    @apply rounded-md bg-darkPurple-800 p-4;
}

.infoBox h2 {
    @apply text-lg font-semibold;
}

.infoBox .list {
    @apply mt-2;
}
</style>
