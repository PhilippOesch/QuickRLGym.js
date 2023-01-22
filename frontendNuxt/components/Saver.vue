<template>
    <div>
        <Button
            :size="ButtonSize.Large"
            value="Save Model"
            @click="save"
        ></Button>
    </div>
</template>

<script lang="ts" setup>
import { PropType } from 'vue';
import BrowserFileManager from '~~/utils/BrowserFileManager';
import { TrainableAgent } from 'quickrl.core';

const props = defineProps({
    agentObject: Object as PropType<TrainableAgent>,
});

const fileManager = new BrowserFileManager();

function save(): void {
    if (props.agentObject == undefined) {
        return;
    }

    console.log('save Agent');
    console.log(props.agentObject);
    fileManager.path = 'model.json';
    props.agentObject.save(fileManager);
}
</script>

<style scoped></style>
