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
        <div class="loaderButtonContainer">
            <Button
                :size="ButtonSize.Large"
                value="Load Model"
                :handler="loadAgent"
                :disabled="loaderDisabled"
            />
            <div v-if="agentLoaded" class="agentLoadedInfo">
                Agent has been loaded
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { SingleAgentEnvironment, PersistableAgent } from 'quickrl.core';
import { FileStrategies } from 'quickrl.web';
import useAgent, { agentMapping } from '~~/comsosable/useAgent';
import useSettingsStore from '~~/comsosable/useSettingsStore';

export interface AgentLoaderProps {
    gameId: string;
    activeAlgorithm: string;
    env?: SingleAgentEnvironment;
    agentObject?: PersistableAgent<any, any>;
}
const props = defineProps<AgentLoaderProps>();

const loaderInputModel = ref();
const loaderInputConfig = ref();
const loaderInputWeights = ref();

const fileNameDefault = 'No File Selected';

const modelFileName = ref(fileNameDefault);
const loaderDisabled = ref(true);
// const binWeightsActive = ref(false);
const binWeightsActive = computed(() => {
    console.log('active Algo', props.activeAlgorithm);
    return agentMapping.get(props.activeAlgorithm)?.usesTensorflow
        ? agentMapping.get(props.activeAlgorithm)!.usesTensorflow
        : false;
});

const settingStore = useSettingsStore();

const agentLoaded = ref(false);

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

async function loadAgent(): Promise<void> {
    console.log('load');
    if (props.agentObject == undefined) {
        await loadNewAgent();
    } else {
        await loadIntoExistingAgent();
    }
}

async function loadIntoExistingAgent() {
    let loadAgent: PersistableAgent<any, any> = <PersistableAgent<any, any>>(
        props.agentObject
    );
    await loadAgentFiles(loadAgent);
}

function isValidFileType(file: File) {
    return validFileTypes.includes(file.type);
}

async function loadNewAgent(): Promise<void> {
    if (props.env == undefined) {
        console.warn(
            'Agent can not be initialized because the enviroment is not initialized'
        );
        return;
    }
    const activeAlgorithm: string = settingStore.getActiveAlgorithm(
        props.gameId
    );

    let agent: PersistableAgent<any, any> = <PersistableAgent<any, any>>(
        useAgent(activeAlgorithm, props.env)
    );
    agent = await loadAgentFiles(agent);
    emit('loadNewAgent', agent);
}

async function loadAgentFiles(
    agent: PersistableAgent<any, any>
): Promise<PersistableAgent<any, any>> {
    const modelFile: File = loaderInputModel.value.files[0];
    const configFile: File = loaderInputConfig.value.file[0];

    let weightFile: File;
    if (binWeightsActive.value) {
        weightFile = loaderInputWeights.value.files[0];
    }

    if (isValidFileType(configFile)) {
        await agent.loadConfig(
            new FileStrategies.WebJSONFileLoader({ file: configFile })
        );

        settingStore.updateSetting(
            props.gameId,
            props.activeAlgorithm,
            agent.config
        );
    }

    if (!binWeightsActive.value && isValidFileType(modelFile)) {
        await agent.load(
            new FileStrategies.WebJSONFileLoader({
                file: modelFile,
            })
        );
        agentLoaded.value = true;
    }

    if (
        binWeightsActive.value &&
        isValidFileType(modelFile) &&
        isValidFileType(weightFile!)
    ) {
        await agent.load(
            new FileStrategies.WebTFModelLoader({
                modelFile: modelFile,
                weightFile: weightFile!,
            })
        );
        agentLoaded.value = true;
    }
    return agent;
}
</script>

<style lang="postcss" scoped>
input[type='file'] {
    display: none;
}

.fileNameLabel {
    @apply flex py-2 px-4;
}

.fileLoaderContainer {
    @apply flex gap-4;
}

.fileUploadElement .inputButton {
    @apply flex cursor-pointer rounded-md bg-darkPurple-700 py-2 px-4 text-base drop-shadow;
}

.loaderButtonContainer {
    @apply flex flex-row;
}

.agentLoadedInfo {
    @apply block py-2 px-4;
}
</style>
