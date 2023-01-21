<template>
    <div class="mainContainer">
        <!-- <Menu></Menu> -->
        <h1>Blackjack</h1>
        <Game gameId="BlackJack" :accentColor="IconColor.Green"></Game>
    </div>
</template>
<script setup lang="ts">
import { IconColor } from '~~/utils/enums';

definePageMeta({
    layout: 'game-page',
});
</script>
