<template>
    <div class="fileLoaderContainer">
        <input
            class="fileLoaderElement"
            type="file"
            @change="loadAgent()"
            ref="loaderInput"
        />
    </div>
</template>

<script setup lang="ts">
import { TrainableAgent } from 'quickrl.core';
import { PropType } from 'vue';
import BrowserFileManager from '~~/utils/BrowserFileManager';

const loaderInput = ref();

const validFileTypes = ['application/json'];

const props = defineProps({
    agentObject: Object as PropType<TrainableAgent>,
});

const fileManager: BrowserFileManager = new BrowserFileManager();

async function loadAgent(): Promise<void> {
    console.log('load');
    if (props.agentObject == undefined) {
        return;
    }
    console.log(props.agentObject);

    const files: File[] = loaderInput.value.files;

    if (isValidFileType(files[0])) {
        fileManager.file = files[0];
        await props.agentObject?.load(fileManager);
    }
    console.log(props.agentObject);
}

function isValidFileType(file: File) {
    return validFileTypes.includes(file.type);
}
</script>

<style scoped></style>
