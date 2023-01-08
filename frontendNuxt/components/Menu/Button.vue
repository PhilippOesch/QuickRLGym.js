<template>
    <div class="menuButtonContainer" @click="callClickHandler">
        <i class="menuIcon quickrl-menu"></i>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        clickHandler: {
            type: Function,
            required: true,
        },
    },
    setup() {
        return {};
    },
    methods: {
        callClickHandler() {
            this.clickHandler();
        },
    },
});
</script>

<style lang="postcss" scoped>
.menuButtonContainer {
    @apply fixed top-0 right-0 p-6 text-5xl cursor-pointer z-30;
}
</style>
