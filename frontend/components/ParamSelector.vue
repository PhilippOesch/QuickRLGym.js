<template>
    <div :class="[selectionType, 'paramContainer']">
        <h3 v-if="title">{{ title }}</h3>
        <div class="settingsContainer">
            <template v-for="(item, index) in settingsObject" v-if="settings">
                <InputSlider
                    v-if="getType(item) === 'Slider'"
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
                    v-if="getType(item) === 'Number'"
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
                    v-if="getType(item) === 'Toggle'"
                    :name="index"
                    :title="item.displayName"
                    :defaultValue="settings[index]"
                    @updated="(value) => updateSettings(value, index)"
                    :disabled="isDisabled"
                    :accentColor="accentColor"
                >
                </InputToggle>
                <InputArray
                    v-if="getType(item) === 'Array'"
                    :name="index"
                    :delimiter="item.setting.delimiter"
                    :title="item.displayName"
                    :defaultValue="settings[index]"
                    @updated="(value) => updateSettings(value, index)"
                    :disabled="isDisabled"
                >
                </InputArray>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { PropType, computed, onMounted } from 'vue';
import {
    SettingArray,
    SettingBoolean,
    SettingNumber,
} from '~~/utils/settingsInterfaces/general';
import { IconColor, InputStyleType, SelectionType } from '~~/utils/enums';
import useSettingsStore from '~~/comsosable/useSettingsStore';

const props = defineProps({
    gameId: {
        type: String,
        required: true,
    },
    settingsName: {
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