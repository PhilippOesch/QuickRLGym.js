<template>
    <div class="tabContainer">
        <h3 ref="einElement">Parameters:</h3>
        <div class="settingsContainer">
            <div v-for="(item, index) in settingsObject">
                <Slider
                    v-if="getType(item) == 'Slider'"
                    :name="index"
                    :title="item.displayName"
                    :max="item.setting.max"
                    :min="item.setting.min"
                    :defaultValue="item.setting.value"
                    :stepSize="item.setting.stepSize"
                    @updated="(value) => updateSettings(value, index)"
                ></Slider>
                <NumberInput
                    v-if="getType(item) == 'Number'"
                    :name="index"
                    :title="item.displayName"
                    :max="item.setting.max"
                    :min="item.setting.min"
                    :defaultValue="item.setting.value"
                    :stepSize="item.setting.stepSize"
                    @updated="(value) => updateSettings(value, index)"
                >
                </NumberInput>
                <Toggle
                    v-if="getType(item) == 'Toggle'"
                    :name="index"
                    :title="item.displayName"
                    :defaultValue="item.setting"
                    @updated="(value) => updateSettings(value, index)"
                >
                </Toggle>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { AlgSetting, SettingNumber } from '~~/utils/settingsInterfaces/general';
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
    setup() {
        const settingsStore = useSettingsStore();

        return { settingsStore };
    },
    data() {
        return {
            settings: {},
        };
    },
    methods: {
        getType(item: any) {
            if ((item as AlgSetting<SettingNumber>) !== undefined) {
                if (
                    item.setting.max !== undefined &&
                    item.setting.min !== undefined
                ) {
                    return 'Slider';
                }
                if (item.setting.value !== undefined) return 'Number';
            }
            if ((item as AlgSetting<boolean>) !== undefined) {
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
    mounted() {
        for (const index in this.settingsObject) {
            const el = this.settingsObject[index];
            const elType = this.getType(this.settingsObject[index]);
            if (elType === 'Slider' || elType === 'Number') {
                this.updateSettings(el.setting.value, index);
            } else {
                this.updateSettings(el.setting, index);
            }
        }
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
