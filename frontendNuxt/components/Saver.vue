<template>
    <div>
        <Button
            :size="ButtonSize.Large"
            value="Save Model"
            @click="save"
            :disabled="agentObject == undefined || !getIsActive(gameId)"
        ></Button>
    </div>
</template>

<script lang="ts" setup>
import BrowserFileManager from '~~/utils/BrowserFileManager';
import { TrainableAgent } from 'quickrl.core';
import { PropType } from 'vue';
import useSettingsStore from '~~/comsosable/useSettingsStore';

const props = defineProps({
    agentObject: Object as PropType<TrainableAgent>,
    gameId: {
        type: String,
        required: true,
    },
});

const fileManager = new BrowserFileManager();

const { getIsActive } = useSettingsStore();

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
