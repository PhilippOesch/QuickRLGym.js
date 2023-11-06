<template>
  <div class="alertWrapper">
    <div class="alertContainer">
      <h1 v-if="title">{{ title }}</h1>
      <p v-if="content">{{ content }}</p>
      <div class="buttons">
        <Button value="Ok" :size="Enums.ButtonSize.Normal" :handler="onSuccess">
        </Button>
        <Button
          value="Abort"
          :size="Enums.ButtonSize.Normal"
          :handler="onAbort"
        >
        </Button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Enums } from "~/types";
export interface AlertProps {
  title?: string;
  content?: string;
  onSuccess?: () => any;
  onAbort?: () => any;
}
defineProps<AlertProps>();
</script>

<style lang="postcss" scoped>
.alertWrapper {
  @apply fixed w-full h-full bg-darkPurple-900 bg-opacity-80 top-0 left-0 z-50 grid place-content-center;
}

.alertContainer {
  @apply text-lg p-5 bg-darkPurple-800 rounded-md text-center;
}

.buttons {
  @apply flex gap-2;
}
</style>
