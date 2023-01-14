<template>
    <div :class="['paramContainer', selectionType]">
        <h3 v-if="title">{{ title }}</h3>
        <div class="settingsContainer">
            <template v-for="(item, index) in settingsObject">
                <InputSlider
                    v-if="getType(item) == 'Slider'"
                    :name="index"
                    :title="item.displayName"
                    :max="item.setting.max"
                    :min="item.setting.min"
                    :defaultValue="settings[index]"
                    :stepSize="item.setting.stepSize"
                    @updated="(value) => updateSettings(value, index)"
                    :disabled="isDisabled"
                    :accentColor="accentColor"
                ></InputSlider>
                <InputNumber
                    v-if="getType(item) == 'Number'"
                    :name="index"
                    :title="item.displayName"
                    :max="item.setting.max"
                    :min="item.setting.min"
                    :defaultValue="settings[index]"
                    :stepSize="item.setting.stepSize"
                    @updated="(value) => updateSettings(value, index)"
                    :inputStyle="
                        selectionType === SelectionType.Grid
                            ? InputStyleType.Dark
                            : InputStyleType.Light
                    "
                    :disabled="isDisabled"
                >
                </InputNumber>
                <InputToggle
                    v-if="getType(item) == 'Toggle'"
                    :name="index"
                    :title="item.displayName"
                    :defaultValue="settings[index]"
                    @updated="(value) => updateSettings(value, index)"
                    :disabled="isDisabled"
                >
                </InputToggle>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue';
import { Setting, SettingNumber } from '~~/utils/settingsInterfaces/general';
import { IconColor, InputStyleType, SelectionType } from '~~/utils/enums';
import useSettingsStore from '~~/comsosable/useSettingsStore';

const props = defineProps({
    gameID: {
        type: String,
        required: true,
    },
    algorithmName: {
        type: String,
        required: true,
    },
    settingsObject: {
        type: Object,
        required: true,
    },
    selectionType: {
        type: Object as PropType<SelectionType>,
        default: SelectionType.Grid,
    },
    title: {
        type: String,
    },
    accentColor: {
        type: Object as PropType<IconColor>,
    },
});

const settingsStore = useSettingsStore();

let isDisabled = computed(() => !settingsStore.getIsActive(props.gameID));

let settings = settingsStore.getSetting(props.gameID, props.algorithmName);
console.log('settings', settings);

if (props.algorithmName !== 'gameSettings') {
    settingsStore.setActiveAlgorithm(props.gameID, props.algorithmName);
    console.log(props);
}

function getType(item: any) {
    if ((item as Setting<SettingNumber>) !== undefined) {
        if (item.setting.max !== undefined && item.setting.min !== undefined) {
            return 'Slider';
        }
        if (item.setting.stepSize !== undefined) return 'Number';
    }
    if ((item as Setting<boolean>) !== undefined) {
        return 'Toggle';
    }
}

function updateSettings(value: any, index: string): void {
    settings = { ...settings, [index]: value };
    settingsStore.updateSetting(props.gameID, props.algorithmName, settings);
}
</script>

<style lang="postcss" scoped>
.paramContainer {
    @apply drop-shadow rounded-md py-3;
}

.selectionGrid {
    @apply bg-darkPurple-800 px-4;
}

.SelectionFree {
    @apply mt-0;
}

h3 {
    @apply text-2xl;
}

.settingsContainer {
    @apply gap-8;
}

.selectionGrid .settingsContainer {
    @apply grid mt-6 lg:grid-cols-6 gap-8;
}

.SelectionFree .settingsContainer {
    @apply flex flex-wrap;
}
</style>
