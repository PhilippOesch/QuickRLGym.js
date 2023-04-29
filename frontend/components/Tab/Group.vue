<template>
    <div>
        <div class="tabSelectContainer" v-if="tabs">
            <template v-for="(item, index) in tabs">
                <div
                    class="tab"
                    :class="[
                        getOpenTab === item ||
                        (getOpenTab === undefined && index === 0)
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
import { ComputedRef } from 'vue';
import { PropType } from 'vue';
import useTabStore from '~~/comsosable/useTabStore';
import { IconColor } from '~~/utils/enums';

const props = defineProps({
    groupName: {
        type: String,
        required: true,
    },
    accentColor: Object as PropType<IconColor>,
});

const tabStore = useTabStore();

const getOpenTab = computed(() => tabStore.getOpenTab(props.groupName));
let tabs: ComputedRef = computed(() => tabStore.getGroupTabs(props.groupName));

tabStore.getOpenTab(props.groupName);
console.log('openTabRef', getOpenTab);

tabStore.$onAction((info) => {
    if (info.name === 'switchTab') {
    }
});

function switchTab(idx: number) {
    tabStore.switchTab(props.groupName, tabs.value[idx]);
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
