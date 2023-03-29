<template>
    <div class="menuButtonContainer" @click="callClickHandler">
        <!-- <i class="menuIcon quickrl-menu"></i> -->
        <div class="closed menuFriesContainer" :class="{ opened: opened }">
            <div class="menuFrie topFrie"></div>
            <div class="menuFrie middleFrie"></div>
            <div class="menuFrie bottomFrie"></div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { defineProps } from 'vue';

const props = defineProps({
    clickHandler: {
        type: Function,
        required: true,
    },
    opened: {
        type: Boolean,
        default: false,
    },
});

function callClickHandler() {
    props.clickHandler();
}
</script>

<style lang="postcss" scoped>
.menuButtonContainer {
    @apply fixed top-0 right-0 p-6 text-5xl cursor-pointer z-30;
}

.menuFriesContainer {
    @apply w-12 h-8 grid;
}

.menuFriesContainer .menuFrie {
    @apply h-1 bg-gray-50 rounded-full relative block duration-300 transition-all;
}

.menuFriesContainer .topFrie {
    @apply place-self-start w-9;
}

.menuFriesContainer .middleFrie {
    @apply place-self-center w-12;
}

.menuFriesContainer .bottomFrie {
    @apply place-self-end w-9;
}

.menuFriesContainer.opened > .topFrie {
    @apply rotate-[40deg] translate-y-[9px];
}

.menuFriesContainer.opened > .bottomFrie {
    @apply rotate-[40deg] -translate-y-[9px];
}

.menuFriesContainer.opened > .middleFrie {
    @apply -rotate-[40deg];
}
</style>
