<template>
    <div class="sliderWrapper">
        <h3 class="title">{{ title }}</h3>
        <div class="container">
            <input
                class="sliderInput"
                type="range"
                :name="name"
                :id="name"
                :max="max"
                :min="min"
                :value="value"
                @change="(event)=> finishEdit(event.target as HTMLInputElement)"
                @input="(event) => update(event.target as HTMLInputElement)"
                :step="stepSize"
            />
            <input
                type="number"
                class="sliderNumInput"
                :id="name + '-input'"
                :value="value"
                :max="max"
                :min="min"
                @change="(event)=> finishEdit(event.target as HTMLInputElement)"
                @input="(event) => update(event.target as HTMLInputElement)"
                :step="stepSize"
            />
        </div>
        <!-- @input="(event) => update(event.target as HTMLInputElement)" -->
        <!-- :value="value" -->
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    expose: ['getValue'],
    props: {
        name: String,
        title: String,
        max: Number,
        min: Number,
        defaultValue: Number,
        stepSize: Number,
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
.sliderWrapper {
    @apply w-full col-span-2;
}

.sliderWrapper .title {
    @apply text-lg;
}

.sliderInput {
    @apply w-full;
}

.sliderInput {
    -webkit-appearance: none; /* Override default look */
    appearance: none;
    @apply h-4 rounded-full bg-gray-600;
}

.sliderInput::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    @apply bg-sky-400 rounded-full w-7 h-7 border;
    cursor: pointer;
}

.sliderInput::-moz-range-thumb {
    @apply bg-sky-400 rounded-full w-7 h-7;
    cursor: pointer;
}

.sliderNumInput {
    @apply w-28 ml-4 bg-gray-900 py-1 px-2 rounded-md;
}

.sliderWrapper .container {
    @apply flex mt-2 place-content-center place-items-center;
}

.sliderWrapper .container p {
    @apply bg-gray-900;
}
</style>
