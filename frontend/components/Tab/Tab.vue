<template>
    <div class="tabContainer" v-if="isVisible">
        <slot></slot>
    </div>
</template>
<script setup lang="ts">
import { defineProps, computed } from 'vue';
import useTabStore from '~~/comsosable/useTabStore';

const props = defineProps({
    tabGroup: { type: String, required: true },
    name: { type: String, required: true },
});

const tabStore = useTabStore();

const isVisible = computed(() => {
    const tab = tabStore.getTab(props.tabGroup, props.name);
    if (!tab) return false;
    return tab.selected;
});
</script>

<style lang="postcss" scoped></style>
