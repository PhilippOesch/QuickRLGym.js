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
    onLeaveHandler: Function,
});

const tabStore = useTabStore();

tabStore.add(props.tabGroup, props.name);

const emit = defineEmits(['tabSwitching']);

const isVisible = computed(() => {
    const selectedTab = tabStore.getOpenTab(props.tabGroup);
    if (selectedTab !== undefined && selectedTab === props.name) {
        return true;
    }
    return false;
});

callEnteredHandler();

watch(
    () => tabStore.getOpenTab(props.tabGroup),
    (newTab, prevTab) => {
        if (prevTab === props.name) {
            console.log('prevTab', prevTab);

            let res =
                props.onLeaveHandler !== undefined
                    ? props.onLeaveHandler()
                    : true;
            if (props.onLeaveHandler && !res && prevTab) {
                tabStore.switchTab(props.tabGroup, prevTab);
            }
            emit('tabSwitching', newTab, prevTab);
            console.log('res', res);
            return res;
        }
        if (newTab === props.name) {
            console.log('newTab', newTab);
            callEnteredHandler();
        }
    }
);

function callEnteredHandler() {
    if (props.onEnterHandler) {
        props.onEnterHandler();
    }
}
</script>

<style lang="postcss" scoped></style>
