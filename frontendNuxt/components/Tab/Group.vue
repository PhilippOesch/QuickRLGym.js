<template>
    <div>
        <div class="tabSelectContainer">
            <template v-for="(item, index) in tabs">
                <div
                    class="tab"
                    :class="{ selected: getOpenTab == item }"
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

<script lang="ts">
import { defineComponent, PropType } from 'vue';

import useTabStore from '~~/comsosable/useTabStore';

export default defineComponent({
    props: {
        tabs: {
            type: Object as PropType<string[]>,
            required: true,
        },
        groupName: {
            type: String,
            required: true,
        },
    },
    setup(props) {
        const tabStore = useTabStore();

        for (const tab of props.tabs) {
            tabStore.add(props.groupName, tab);
        }
        tabStore.initialize(props.groupName, props.tabs[0]);
        return { tabStore };
    },
    computed: {
        getOpenTab() {
            return this.tabStore.getOpenTab(this.groupName)?.name;
        },
    },
    methods: {
        switchTab(idx: number) {
            this.tabStore.switchTab(this.groupName, this.tabs[idx]);
        },
    },
});
</script>

<style lang="postcss" scoped>
.tabSelectContainer {
    @apply bg-slate-800 px-2 py-2 rounded-md flex gap-2 drop-shadow mt-6 max-w-fit;
}

.tab {
    @apply px-6 py-3 hover:bg-slate-700 rounded-md duration-300 cursor-pointer;
}

.selected {
    @apply bg-sky-600 hover:bg-sky-600;
}
</style>
