<template>
    <div>
        <Button
            :size="ButtonSize.Large"
            value="Save Model"
            :handler="save"
            :disabled="agentObject === undefined || !getIsActive(gameId)"
        ></Button>
    </div>
</template>

<script lang="ts" setup>
import { PersistableAgent } from 'quickrl.core';
import { PropType } from 'vue';
import { FileStrategies } from 'quickrl.web';
import useSettingsStore from '~~/comsosable/useSettingsStore';
import { agentMapping } from '~~/comsosable/useAgent';

const props = defineProps({
    agentObject: Object as PropType<PersistableAgent<any, any>>,
    gameId: {
        type: String,
        required: true,
    },
});

const { getIsActive, getActiveAlgorithm } = useSettingsStore();

async function save(): Promise<void> {
    if (props.agentObject == undefined) {
        return;
    }

    const activeAlgorithm = getActiveAlgorithm(props.gameId);
    const isTFModel: boolean =
        agentMapping.get(activeAlgorithm)!.usesTensorflow;

    const trainableAgent: PersistableAgent<any, any> = <
        PersistableAgent<any, any>
    >props.agentObject;

    console.log('save Agent');
    console.log(props.agentObject);

    await trainableAgent.saveConfig(
        new FileStrategies.WebJSONFileSaver({
            fileName: 'config.json',
        })
    );
    if (isTFModel) {
        await trainableAgent.save(new FileStrategies.WebTFModelSaver());
    } else {
        await trainableAgent.save(
            new FileStrategies.WebJSONFileSaver({
                fileName: 'model.json',
            })
        );
    }
}
</script>
