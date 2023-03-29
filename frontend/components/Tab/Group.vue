<template>
    <div>
        <div class="tabSelectContainer">
            <template v-for="(item, index) in tabs">
                <div
                    class="tab"
                    :class="[
                        getOpenTab === item
                            ? [
                                  `hover:bg-${accentColor}-700`,
                                  `bg-${accentColor}-700`,
                              ]
                            : '',
                    ]"
                    @click="switchTab(index)"
                >
                    {{ item }}
                </div>
            </template>
        </div>
        <div class="tabView">
            <slot></slot>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import useTabStore from '~~/comsosable/useTabStore';
import { IconColor } from '~~/utils/enums';

const props = defineProps({
    tabs: {
        type: Object as PropType<string[]>,
        required: true,
    },
    groupName: {
        type: String,
        required: true,
    },
    accentColor: Object as PropType<IconColor>,
});

const tabStore = useTabStore();

for (const tab of props.tabs) {
    tabStore.add(props.groupName, tab);
}
tabStore.initialize(props.groupName, props.tabs[0]);

const getOpenTab = computed(() => {
    return tabStore.getOpenTab(props.groupName)?.name;
});

function switchTab(idx: number) {
    tabStore.switchTab(props.groupName, props.tabs[idx]);
}
</script>

<style lang="postcss" scoped>
.tabSelectContainer {
    @apply mt-6 flex max-w-fit gap-2 rounded-md bg-darkPurple-800 px-2 py-2 drop-shadow;
}

.tab {
    @apply cursor-pointer rounded-md px-6 py-3 duration-300 hover:bg-darkPurple-700;
}
</style>
