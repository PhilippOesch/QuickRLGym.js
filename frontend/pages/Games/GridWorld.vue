<template>
  <h1>GridWorld</h1>
  <Game
    gameId="GridWorld"
    :accentColor="Enums.IconColor.Sky"
    contentPath="/gridworld"
    :renderBetweenMoves="500"
  ></Game>
</template>

<script setup lang="ts">
import { Enums } from "~/types";

definePageMeta({
  layout: "game-page",
});
</script>

<style scoped></style>
