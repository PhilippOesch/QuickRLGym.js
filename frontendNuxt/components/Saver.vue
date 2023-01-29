<template>
    <div>
        <Button
            :size="ButtonSize.Large"
            value="Save Model"
            :handler="save"
            :disabled="agentObject == undefined || !getIsActive(gameId)"
        ></Button>
    </div>
</template>

<script lang="ts" setup>
import BrowserFileManager from '~~/utils/BrowserFileManager';
import { PersistentAgent } from 'quickrl.core';
import { PropType } from 'vue';
import useSettingsStore from '~~/comsosable/useSettingsStore';
import TFBrowserFileManager from '~~/utils/TFBrowserFileManager';
import { agentMapping } from '~~/comsosable/useAgent';

const props = defineProps({
    agentObject: Object as PropType<PersistentAgent>,
    gameId: {
        type: String,
        required: true,
    },
});

const fileManager = new BrowserFileManager();
const tfFileManager = new TFBrowserFileManager();

const { getIsActive, getActiveAlgorithm } = useSettingsStore();

function save(): void {
    if (props.agentObject == undefined) {
        return;
    }

    const activeAlgorithm = getActiveAlgorithm(props.gameId);
    const isTFModel: boolean =
        agentMapping.get(activeAlgorithm)!.usesTensorflow;

    const trainableAgent: PersistentAgent = <PersistentAgent>props.agentObject;

    console.log('save Agent');
    console.log(props.agentObject);
    fileManager.path = 'config.json';
    trainableAgent.saveConfig(fileManager);
    if (isTFModel) {
        trainableAgent.save(tfFileManager);
    } else {
        fileManager.path = 'model.json';
        trainableAgent.save(fileManager);
    }
}
</script>
