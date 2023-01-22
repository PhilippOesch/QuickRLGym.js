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
import BrowserFileManager from '~~/utils/BrowserFileManager';
import { TrainableAgent } from 'quickrl.core';
import { PropType } from 'vue';

const props = defineProps({
    agentObject: Object as PropType<any>,
});

const fileManager = new BrowserFileManager();

function save(): void {
    if (props.agentObject == undefined) {
        return;
    }

    const trainableAgent = props.agentObject as TrainableAgent;

    console.log('save Agent');
    console.log(props.agentObject);
    fileManager.path = 'model.json';
    trainableAgent.save(fileManager);
}
</script>

<style scoped></style>
