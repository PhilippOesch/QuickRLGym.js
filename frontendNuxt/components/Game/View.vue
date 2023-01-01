<template>
    <div class="gameWrapper">
        <Tab tabGroup="trainingBenchmarkSwitch" name="Training">
            <div class="info">
                <div class="infoBox gameInfo">
                    <h2>Current Game Info:</h2>
                    <ul class="list" v-if="getGameInfo">
                        <li
                            class="flex gap-2"
                            v-for="(item, index) in getGameInfo"
                        >
                            <span>{{ index }}:</span><span>{{ item }}</span>
                        </li>
                    </ul>
                </div>
                <div class="infoBox trainingInfo">
                    <h2>Training Progress - Iteration {{ iteration }}</h2>
                    <ul class="list" v-if="stats">
                        <li class="flex gap-2" v-for="(item, index) in stats">
                            <span>{{ index }}:</span><span>{{ item }}</span>
                        </li>
                    </ul>
                </div>
            </div>
        </Tab>
        <div class="gameContainer" ref="gameContainer"></div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import useGameEnv, { TaxiSceneInfo } from '../../comsosable/useGameEnv';
//import { Games } from 'quickrl.core';
import TaxiGameScene from '../../utils/GameScenes/TaxiGameScene';

interface initialData {
    taxiEnvInfo?: TaxiSceneInfo;
    stats?: object;
    iteration: number;
}

export default defineComponent({
    props: {
        id: String,
    },
    setup() {
        return {};
    },
    data(): initialData {
        return {
            taxiEnvInfo: undefined,
            stats: undefined,
            iteration: 0,
        };
    },
    computed: {
        getGameInfo() {
            if (!this.taxiEnvInfo) return null;
            const info = this.taxiEnvInfo as TaxiSceneInfo;
            return {
                gameIteration: info.env.iteration,
                points: info.env.getReturn,
                destination:
                    TaxiGameScene.destMapping[info.env.game.customer.destIdx],
            };
        },
    },
    async mounted() {
        const gameContainer: HTMLElement = this.$refs
            .gameContainer as HTMLElement;
        window.Phaser = await import('phaser');
        console.log(window.Phaser);
        this.taxiEnvInfo = await useGameEnv(gameContainer);
        this.stats = this.taxiEnvInfo.env.stats;
    },
});
</script>

<style lang="postcss" scoped>
.gameWrapper .info {
    @apply grid lg:grid-cols-6 gap-8 mb-4;
}

.gameWrapper .infoBox {
    @apply bg-slate-700 p-4 rounded-md;
}

.gameInfo {
    @apply lg:col-span-2;
}

.trainingInfo {
    @apply lg:col-span-4;
}

.infoBox h2 {
    @apply text-lg font-semibold;
}

.infoBox .list {
    @apply mt-2;
}

.gameContainer {
    @apply w-full bg-gray-800 rounded-md max-h-fit;
}

.gameWrapper {
    @apply w-full relative p-4 bg-gray-800 rounded-md drop-shadow;
}

.gameContainer :deep(canvas) {
    @apply pointer-events-none;
}
</style>
