<template>
    <div class="fileLoaderContainer">
        <label for="modelUpload" class="fileUploadElement">
            <input
                class="fileLoaderElement"
                id="modelUpload"
                type="file"
                ref="loaderInputModel"
                @change="modelFileChanged"
            /><span class="inputButton">Select Model File</span>
            <span class="fileNameLabel">{{ modelFileName }}</span>
        </label>
        <label for="configUpload" class="fileUploadElement">
            <input
                class="fileLoaderElement"
                id="configUpload"
                type="file"
                ref="loaderInputConfig"
                @change="configFileChanged"
            /><span class="inputButton">Select Config File</span
            ><span class="fileNameLabel">{{ configFileName }}</span></label
        >
        <label
            v-if="binWeightsActive"
            for="weightsUpload"
            class="fileUploadElement"
        >
            <input
                class="fileLoaderElement"
                id="weightsUpload"
                type="file"
                ref="loaderInputWeights"
                @change="weightsFileChanged"
            /><span class="inputButton">Select Weights File</span
            ><span class="fileNameLabel">{{ weightsFileName }}</span></label
        >
        <Button
            :size="ButtonSize.Large"
            value="Load Model"
            :handler="loadAgent"
            :disabled="loaderDisabled"
        />
    </div>
</template>

<script setup lang="ts">
import { SingleAgentEnvironment, PersistentAgent } from 'quickrl.core';
import { PropType } from 'vue';
import useAgent, { agentMapping } from '~~/comsosable/useAgent';
import useSettingsStore from '~~/comsosable/useSettingsStore';
import useTabStore from '~~/comsosable/useTabStore';
import BrowserFileManager from '~~/utils/BrowserFileManager';
import TFBrowserFileManager from '~~/utils/TFBrowserFileManager';

const loaderInputModel = ref();
const loaderInputConfig = ref();
const loaderInputWeights = ref();

const fileNameDefault = 'No File Selected';

const modelFileName = ref(fileNameDefault);
const loaderDisabled = ref(true);
const binWeightsActive = ref(false);

const props = defineProps({
    gameId: {
        type: String,
        required: true,
    },
    env: {
        type: Object as PropType<SingleAgentEnvironment>,
    },
    agentObject: Object as PropType<PersistentAgent>,
});

onMounted(() => {
    setActiveAlgorithm();
});

function modelFileChanged() {
    if (loaderInputModel.value.files.length < 1) {
        return fileNameDefault;
    }
    const selectedFile: File = loaderInputModel.value.files[0];
    modelFileName.value = selectedFile.name;
    checkLoaderDisabled();
}

const configFileName = ref(fileNameDefault);

function configFileChanged() {
    if (loaderInputConfig.value.files.length < 1) {
        return fileNameDefault;
    }
    const selectedFile: File = loaderInputConfig.value.files[0];
    configFileName.value = selectedFile.name;
    checkLoaderDisabled();
}

const weightsFileName = ref(fileNameDefault);

function weightsFileChanged() {
    if (loaderInputWeights.value.files.length < 1) {
        return fileNameDefault;
    }
    const selectedFile: File = loaderInputWeights.value.files[0];
    weightsFileName.value = selectedFile.name;
    checkLoaderDisabled();
}

function checkLoaderDisabled() {
    if (
        loaderInputConfig.value.files.length >= 1 &&
        loaderInputModel.value.files.length >= 1 &&
        (binWeightsActive.value == false ||
            loaderInputWeights.value.files.length >= 1)
    ) {
        loaderDisabled.value = false;
    } else {
        loaderDisabled.value = true;
    }
}

const validFileTypes = [
    'application/json',
    'application/macbinary',
    'application/octet-stream',
];

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
    let loadAgent: PersistentAgent = <PersistentAgent>props.agentObject;
    loadAgent = await loadAgentFiles(loadAgent);
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

    let agent: PersistentAgent = <PersistentAgent>(
        useAgent(activeAlgorithm, props.env)
    );
    agent = await loadAgentFiles(agent);
    emit('loadNewAgent', agent);
}

const tfFileManager = new TFBrowserFileManager();

async function loadAgentFiles(
    agent: PersistentAgent
): Promise<PersistentAgent> {
    const modelFiles: File[] = loaderInputModel.value.files;
    const configFiles: File[] = loaderInputConfig.value.files;

    let weightFiles: File[];
    if (binWeightsActive.value) {
        weightFiles = loaderInputWeights.value.files;
    }

    if (isValidFileType(modelFiles[0])) {
        fileManager.file = configFiles[0];
        await agent.loadConfig(fileManager);
    }

    if (!binWeightsActive.value && isValidFileType(modelFiles[0])) {
        fileManager.file = modelFiles[0];
        await agent.load(fileManager);
    }

    if (
        binWeightsActive.value &&
        isValidFileType(modelFiles[0]) &&
        isValidFileType(weightFiles![0])
    ) {
        tfFileManager.files = [modelFiles[0], weightFiles![0]];
        await agent.load(tfFileManager);
    }
    return agent;
}

watch(
    () => tabStore.getOpenTab(`${props.gameId}-AlgTab`),
    () => {
        loaderInputModel.value.value = null;
        loaderInputConfig.value.value = null;
        if (binWeightsActive.value && loaderInputWeights.value != undefined)
            loaderInputWeights.value.value = null;
        modelFileName.value = fileNameDefault;
        configFileName.value = fileNameDefault;
        weightsFileName.value = fileNameDefault;
        loaderDisabled.value = true;
    }
);

const { getOpenTab } = useTabStore();

watch(
    () => getOpenTab(`${props.gameId}-AlgTab`),
    () => {
        setActiveAlgorithm();
    }
);

function setActiveAlgorithm() {
    const activeAlgorithm = getActiveAlgorithm(props.gameId);
    const isTFModel: boolean =
        agentMapping.get(activeAlgorithm)!.usesTensorflow;
    binWeightsActive.value = isTFModel;
}
</script>

<style lang="postcss" scoped>
input[type='file'] {
    display: none;
}

.fileNameLabel {
    @apply py-2 px-4 flex;
}

.fileLoaderContainer {
    @apply flex gap-4;
}

.fileUploadElement .inputButton {
    @apply bg-darkPurple-700 flex py-2 px-4 text-base rounded-md drop-shadow cursor-pointer;
}
</style>
