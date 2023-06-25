<template>
    <div class="mainContainer">
        <h1>Taxi Game</h1>
        <Game
            gameId="Taxi"
            :accentColor="IconColor.Amber"
            contentPath="/taxi"
        ></Game>
    </div>
</template>
<script setup lang="ts">
import { IconColor } from '~~/utils/enums';

definePageMeta({
    layout: 'game-page',
});
</script>
