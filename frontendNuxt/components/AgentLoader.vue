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
import { Agent, SingleAgentEnvironment, TrainableAgent } from 'quickrl.core';
import { PropType } from 'vue';
import useAgent from '~~/comsosable/useAgent';
import useSettingsStore from '~~/comsosable/useSettingsStore';
import useTabStore from '~~/comsosable/useTabStore';
import BrowserFileManager from '~~/utils/BrowserFileManager';

const loaderInput = ref();

const validFileTypes = ['application/json'];

const props = defineProps({
    gameId: {
        type: String,
        required: true,
    },
    env: {
        type: Object as PropType<SingleAgentEnvironment>,
    },
    agentObject: Object as PropType<Agent>,
});

const emit = defineEmits(['loadNewAgent']);

const fileManager: BrowserFileManager = new BrowserFileManager();

async function loadAgent(): Promise<void> {
    console.log('load');
    if (props.agentObject == undefined) {
        await loadNewAgent();
    } else {
        await loadIntoExistingAgent();
    }
}

async function loadIntoExistingAgent() {
    const files: File[] = loaderInput.value.files;

    if (isValidFileType(files[0])) {
        fileManager.file = files[0];
        const loadAgent: TrainableAgent = props.agentObject as any;
        await loadAgent.load(fileManager);
    }
    console.log(props.agentObject);
}

function isValidFileType(file: File) {
    return validFileTypes.includes(file.type);
}

const { getActiveAlgorithm } = useSettingsStore();
const tabStore = useTabStore();

async function loadNewAgent(): Promise<void> {
    if (props.env == undefined) {
        console.warn(
            'Agent can not be initialized because the enviroment is not initialized'
        );
        return;
    }
    const activeAlgorithm: string = getActiveAlgorithm(props.gameId);

    const agent: any = useAgent(activeAlgorithm, props.env);
    const files: File[] = loaderInput.value.files;

    if (isValidFileType(files[0])) {
        fileManager.file = files[0];
        await agent.load(fileManager);
    }
    emit('loadNewAgent', agent);
}

watch(
    () => tabStore.getOpenTab(`${props.gameId}-AlgTab`),
    () => {
        loaderInput.value.value = null;
    }
);
</script>

<style scoped></style>
