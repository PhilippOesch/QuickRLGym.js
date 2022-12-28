<template>
    <div class="toggleContainer">
        <h3 class="title">{{ title }}</h3>
        <label class="switch">
            <input type="checkbox" />
            <span class="slider round"></span>
        </label>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    props: {
        title: String,
        name: String,
    },
    setup() {
        return {};
    },
});
</script>

<style lang="postcss" scoped>
.toggleContainer {
    @apply w-full flex place-items-center gap-3;
}

.toggleContainer .title {
    @apply text-lg;
}

.switch {
    @apply w-16 h-9 inline-block relative;
}

/* Hide default HTML checkbox */
.switch input {
    @apply hidden;
}

/* The slider */
.slider {
    @apply bg-gray-600 absolute cursor-pointer top-0 left-0 right-0 bottom-0 duration-300;
}

.slider:before {
    content: '';
    @apply absolute left-1 bottom-1 h-7 w-7 bg-gray-50 duration-300;
}

input:checked + .slider {
    @apply bg-sky-400;
}

input:focus + .slider {
    @apply shadow-sky-400;
}

input:checked + .slider:before {
    @apply translate-x-7;
}

/* Rounded sliders */
.slider.round {
    border-radius: 34px;
}

.slider.round:before {
    border-radius: 50%;
}
</style>
