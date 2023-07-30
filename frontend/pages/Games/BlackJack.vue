<template>
    <div class="mainContainer">
        <!-- <Menu></Menu> -->
        <h1>Blackjack</h1>
        <Game
            gameId="BlackJack"
            :accentColor="Enums.IconColor.Green"
            contentPath="/blackjack"
            :renderBetweenMoves="500"
        ></Game>
    </div>
</template>
<script setup lang="ts">
import { Enums } from '~~/types';

definePageMeta({
    layout: 'game-page',
});
</script>
