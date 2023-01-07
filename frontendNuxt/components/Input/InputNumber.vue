<template>
    <div :class="['numberInputContainer', styleClasses]">
        <h3 :class="title">{{ title }}</h3>
        <input
            type="number"
            :name="name"
            :max="max"
            :min="min"
            :value="value"
            :class="inputStyle"
            @change="(event) => finishEdit(event.target as HTMLInputElement)"
            @input="(event) => update(event.target as HTMLInputElement)"
            :step="stepSize"
            :disabled="disabled"
        />
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue';
import { InputStyleType } from '~~/utils/enums';

export default defineComponent({
    expose: ['getValue'],
    props: {
        name: String,
        title: String,
        min: Number,
        max: Number,
        defaultValue: Number,
        styleClasses: String,
        disabled: Boolean,
        stepSize: Number,
        inputStyle: {
            type: Object as PropType<InputStyleType>,
            default: InputStyleType.Dark,
        },
    },
    setup() {
        return {};
    },
    data() {
        return {
            value: this.defaultValue ? this.defaultValue : 0,
        };
    },
    methods: {
        finishEdit(el: HTMLInputElement) {
            if (this.min !== undefined && Number(el.value) < this.min)
                this.value = this.min;
            if (this.max !== undefined && Number(el.value) > this.max)
                this.value = this.max;
            this.$emit('updated', this.value);
        },
        update(el: HTMLInputElement) {
            this.value = Number(el.value);
        },
        getValue() {
            return this.value;
        },
    },
});
</script>

<style lang="postcss" scoped>
.numberInputContainer input {
    @apply w-full py-1 px-2 rounded-md mt-2 disabled:opacity-40;
}

.numberInputContainer h3 {
    @apply text-lg;
}

.numberInputContainer {
    @apply col-span-2;
}

.inputDark {
    @apply bg-gray-900;
}

.inputLight {
    @apply bg-gray-700;
}
</style>
