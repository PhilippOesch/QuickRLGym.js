<template>
    <div class="mainContainer">
        <h1>Taxi Game: Select an Algorithm</h1>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import QuickRLAlgorithm from '~~/utils/Algorithm';
import { MathUtils } from 'quickrl.core';

export default defineComponent({
    setup() {
        //const data = new Vec2(0, 0);
        //console.log(data);

        return {};
    },
    data() {
        return {
            algorithnms: new Set<QuickRLAlgorithm>([
                QuickRLAlgorithm.MonteCarlo,
                QuickRLAlgorithm.QLearning,
            ]),
        };
    },
    mounted() {
        const res = MathUtils.argMax([0, 2, 4, 3]);
        console.log(res);
    },
});
</script>

<style scoped></style>
