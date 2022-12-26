<template>
    <div class="mainContainer">
        <h1 class="title">Select A Game</h1>
        <div class="gameSelectContainer">
            <NuxtLink
                class="linkButton bg-amber-900 hover:bg-amber-800"
                to="/Games/TaxiGame"
                >Taxi Game</NuxtLink
            >
            <NuxtLink
                class="linkButton bg-lime-900 hover:bg-lime-800"
                to="/Games/BlackJackGame"
                >BlackJack</NuxtLink
            >
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        return {};
    },
});
</script>

<style lang="postcss" scoped>
.gameSelectContainer {
    @apply mt-8 grid lg:grid-cols-4 gap-4 grid-cols-1;
}

.linkButton {
    @apply inline-block text-lg px-4 py-4 rounded-lg shadow-md;
}
</style>
