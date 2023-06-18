<template>
    <div :class="[selectionType, 'paramContainer']">
        <h3 v-if="title">{{ title }}</h3>
        <div class="settingsContainer">
            <template v-for="(item, index) in settingsObject" v-if="settings">
                <InputSlider
                    v-if="getType(item) === 'Slider'"
                    :name="index.toString()"
                    :title="item.displayName"
                    :max="item.setting.max"
                    :min="item.setting.min"
                    :defaultValue="settings[index]"
                    :stepSize="item.setting.stepSize"
                    @updated="
                        (value: any) => updateSettings(value, index.toString())
                    "
                    :disabled="isDisabled"
                    :accentColor="accentColor"
                ></InputSlider>
                <InputNumber
                    v-if="getType(item) === 'Number'"
                    :name="index.toString()"
                    :title="item.displayName"
                    :max="item.setting.max"
                    :min="item.setting.min"
                    :defaultValue="settings[index]"
                    :stepSize="item.setting.stepSize"
                    @updated="
                        (value: any) => updateSettings(value, index.toString())
                    "
                    :inputStyle="
                        selectionType === SelectionType.Grid
                            ? InputStyleType.Dark
                            : InputStyleType.Light
                    "
                    :disabled="isDisabled"
                >
                </InputNumber>
                <InputToggle
                    v-if="getType(item) === 'Toggle'"
                    :name="index.toString()"
                    :title="item.displayName"
                    :defaultValue="settings[index]"
                    @updated="
                        (value: any) => updateSettings(value, index.toString())
                    "
                    :disabled="isDisabled"
                    :accentColor="accentColor"
                >
                </InputToggle>
                <InputArray
                    v-if="getType(item) === 'Array'"
                    :name="index.toString()"
                    :delimiter="item.setting.delimiter"
                    :title="item.displayName"
                    :defaultValue="settings[index]"
                    @updated="
                        (value: any) => updateSettings(value, index.toString())
                    "
                    :disabled="isDisabled"
                >
                </InputArray>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue';
import {
    ISettingTemplate,
    SettingArray,
    SettingBoolean,
    SettingNumber,
} from '~~/utils/settingsInterfaces/general';
import { IconColor, InputStyleType, SelectionType } from '~~/utils/enums';
import useSettingsStore from '~~/comsosable/useSettingsStore';

export interface ParamSelectorProps {
    gameId: string;
    settingsName: string;
    settingsObject: ISettingTemplate;
    selectionType: SelectionType;
    title?: string;
    accentColor?: IconColor;
}

const props = withDefaults(defineProps<ParamSelectorProps>(), {
    selectionType: SelectionType.Grid,
});

const settingsStore = useSettingsStore();

let isDisabled = computed(() => !settingsStore.getIsActive(props.gameId));

let settings: any = ref(undefined);

onMounted(() => {
    settings.value = settingsStore.getSetting(props.gameId, props.settingsName);
});

settingsStore.$subscribe(() => {
    settings.value = settingsStore.getSetting(props.gameId, props.settingsName);
});

function getType(item: any): string {
    if ((item.setting as any) instanceof SettingNumber) {
        if (item.setting.max !== undefined && item.setting.min !== undefined) {
            return 'Slider';
        }
        if (item.setting.stepSize !== undefined) return 'Number';
    }
    if (item.setting instanceof SettingArray) {
        return 'Array';
    }
    if (item.setting instanceof SettingBoolean) {
        return 'Toggle';
    }
    return '';
}

function updateSettings(value: any, index: string): void {
    settings.value = { ...settings.value, [index]: value };
    settingsStore.updateSetting(
        props.gameId,
        props.settingsName,
        settings.value
    );
}
</script>

<style lang="postcss" scoped>
.paramContainer {
    @apply rounded-md py-3 drop-shadow;
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
    @apply mt-6 grid gap-8 lg:grid-cols-6;
}

.SelectionFree .settingsContainer {
    @apply flex flex-wrap;
}
</style>
