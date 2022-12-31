<template>
    <div class="tabContainer" v-if="isVisible">
        <slot></slot>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useTabStore from '~~/comsosable/useTabStore';

export default defineComponent({
    props: {
        tabGroup: { type: String, required: true },
        name: { type: String, required: true },
    },
    setup() {
        const tabStore = useTabStore();

        return { tabStore };
    },
    mounted() {},
    computed: {
        isVisible(): boolean {
            const tab = this.tabStore.getTab(this.tabGroup, this.name);
            if (!tab) return false;
            return tab.selected;
        },
    },
});
</script>

<style lang="postcss" scoped>
.tabContainer {
    @apply mt-8;
}
</style>
