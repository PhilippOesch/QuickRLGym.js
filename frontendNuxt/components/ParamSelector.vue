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

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { Setting, SettingNumber } from '~~/utils/settingsInterfaces/general';
import { InputStyleType, SelectionType } from '~~/utils/enums';
import useSettingsStore from '~~/comsosable/useSettingsStore';

export default defineComponent({
    props: {
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
    },
    setup(props) {
        const settingsStore = useSettingsStore();

        const settings = settingsStore.getSetting(
            props.gameID,
            props.algorithmName
        );

        console.log(settings);

        return {
            settingsStore,
            settings,
            SelectionType,
            InputStyleType,
        };
    },
    computed: {
        isDisabled() {
            const isActive = this.settingsStore.getIsActive(this.gameID);
            return !isActive;
        },
    },
    methods: {
        getType(item: any) {
            if ((item as Setting<SettingNumber>) !== undefined) {
                if (
                    item.setting.max !== undefined &&
                    item.setting.min !== undefined
                ) {
                    return 'Slider';
                }
                if (item.setting.stepSize !== undefined) return 'Number';
            }
            if ((item as Setting<boolean>) !== undefined) {
                return 'Toggle';
            }
        },
        updateSettings(value: any, index: string) {
            this.settings = { ...this.settings, [index]: value };
            this.settingsStore.updateSetting(
                this.gameID,
                this.algorithmName,
                this.settings
            );
        },
    },
});
</script>

<style lang="postcss" scoped>
.paramContainer {
    @apply drop-shadow rounded-md py-3;
}

.selectionGrid {
    @apply bg-slate-800 px-4;
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
