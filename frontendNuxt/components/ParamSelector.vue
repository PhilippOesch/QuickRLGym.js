<template>
    <div class="tabContainer">
        <h3 ref="einElement">Parameters:</h3>
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
                >
                </InputNumber>
                <InputToggle
                    v-if="getType(item) == 'Toggle'"
                    :name="index"
                    :title="item.displayName"
                    :defaultValue="settings[index]"
                    @updated="(value) => updateSettings(value, index)"
                >
                </InputToggle>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { Setting, SettingNumber } from '~~/utils/settingsInterfaces/general';
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
    },
    setup(props) {
        const settingsStore = useSettingsStore();

        const settings = settingsStore.getSetting(
            props.gameID,
            props.algorithmName
        );
        console.log(settings);

        return { settingsStore, settings };
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
.tabContainer {
    @apply drop-shadow bg-slate-800 rounded-md px-4 py-3;
}

h3 {
    @apply text-2xl;
}

.settingsContainer {
    @apply grid lg:grid-cols-6 gap-8 mt-6;
}
</style>
