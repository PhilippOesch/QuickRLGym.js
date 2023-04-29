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
    onEnterHandler: Function,
});

const tabStore = useTabStore();

tabStore.add(props.tabGroup, props.name);

const isVisible = computed(() => {
    const selectedTab = tabStore.getOpenTab(props.tabGroup);
    if (selectedTab !== undefined && selectedTab === props.name) {
        callEnteredHandler();
        return true;
    }
    return false;
});

function callEnteredHandler() {
    if (props.onEnterHandler) {
        props.onEnterHandler();
    }
}
</script>

<style lang="postcss" scoped></style>
