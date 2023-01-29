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
import BrowserFileStrategy, {
    BrowserSaveOptions,
} from '~~/utils/BrowserFileStrategy';
import { PersistentAgent } from 'quickrl.core';
import { PropType } from 'vue';
import useSettingsStore from '~~/comsosable/useSettingsStore';
import TFBrowserFileStrategy from '~~/utils/TFBrowserFileStrategy';
import { agentMapping } from '~~/comsosable/useAgent';

const props = defineProps({
    agentObject: Object as PropType<PersistentAgent>,
    gameId: {
        type: String,
        required: true,
    },
});

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
    trainableAgent.saveConfig(new BrowserFileStrategy());
    if (isTFModel) {
        trainableAgent.save(new TFBrowserFileStrategy());
    } else {
        const options: BrowserSaveOptions = { fileName: 'model.json' };
        trainableAgent.save(new BrowserFileStrategy(), options);
    }
}
</script>
