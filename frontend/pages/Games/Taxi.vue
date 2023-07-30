<template>
    <div class="mainContainer">
        <h1>Taxi Game</h1>
        <Game
            gameId="Taxi"
            :accentColor="Enums.IconColor.Amber"
            contentPath="/taxi"
        ></Game>
    </div>
</template>
<script setup lang="ts">
import { Enums } from '~~/types';

definePageMeta({
    layout: 'game-page',
});
</script>
