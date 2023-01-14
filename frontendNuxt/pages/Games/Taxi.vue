<template>
    <div class="mainContainer">
        <Menu></Menu>
        <h1>Taxi Game</h1>
        <!-- <GameTaxi></GameTaxi> -->
        <Game gameId="Taxi" :accentColor="IconColor.Amber"></Game>
    </div>
</template>
<script setup lang="ts">
import { IconColor } from '~~/utils/enums';
</script>
