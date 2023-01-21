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

function save() {
    console.log('save Agent');
    console.log(props.agentObject);
    props.agentObject?.save('model.json', fileManager);
}
</script>

<style scoped></style>
