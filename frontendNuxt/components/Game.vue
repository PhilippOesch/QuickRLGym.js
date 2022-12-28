<template>
    <div class="gameWrapper">
        <div class="info">
            <div class="infoBox gameInfo"><h2>Game Info:</h2></div>
            <div class="infoBox trainingInfo"><h2>Training Progress:</h2></div>
        </div>
        <div class="gameContainer" ref="gameContainer"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useGameEnv, { TaxiSceneInfo } from '../comsosable/useGameEnv';

export default defineComponent({
    props: {
        id: String,
    },
    setup() {
        return {};
    },
    data() {
        return {
            taxiGameInfo: null,
        };
    },
    async mounted() {
        const gameContainer: HTMLElement = this.$refs
            .gameContainer as HTMLElement;
        window.Phaser = await import('phaser');
        console.log(window.Phaser);
        this.taxiGameInfo = await useGameEnv(gameContainer);
        const info = this.taxiGameInfo as TaxiSceneInfo;
        const stats = info.env.getStats;
        console.log(stats);
    },
});
</script>

<style lang="postcss" scoped>
.gameWrapper .info {
    @apply grid lg:grid-cols-2 gap-8 mb-4;
}

.gameWrapper .infoBox {
    @apply bg-slate-700 p-4 rounded-md;
}

.infoBox h2 {
    @apply text-lg;
}

.gameContainer {
    @apply w-full bg-gray-800 rounded-md max-h-fit;
}

.gameWrapper {
    @apply w-full relative p-4 bg-gray-800 rounded-md drop-shadow;
}
</style>
