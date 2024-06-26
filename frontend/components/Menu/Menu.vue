<template>
    <MenuButton :clickHandler="toggleMenu" :opened="menuOpen"></MenuButton>
    <div
        class="MenuWrapper"
        :class="[menuOpen ? 'menuOpenStyle' : 'menuClosedStyle']"
    >
        <div class="menuContainer">
            <NuxtLink class="menuLink home" to="/">
                <i class="icon quickrl-home" alt="Home" />
                <div class="rightSide">
                    <span>Home</span>
                </div>
            </NuxtLink>
            <hr />
            <h2 class="menuTitle">Games</h2>
            <template v-for="link in gameLinks" :key="link.link">
                <div class="menuLink" @click="navigate(link.link)">
                    <i :class="setClasses(link)" :alt="link.title" />
                    <div class="rightSide">
                        <span>{{ link.title }}</span>
                    </div>
                </div>
            </template>
        </div>
    </div>
    <div class="MenuOverlay" v-if="menuOpen" @click="toggleMenu"></div>
</template>

<script setup lang="ts">
import { Ref, ref } from 'vue';
import { gameLinks } from '~~/constants';

const menuOpen: Ref<boolean> = ref(false);

function toggleMenu(): void {
    menuOpen.value = !menuOpen.value;
}

function setClasses(link: any): string[] {
    return ['icon', 'quickrl-' + link.icon, `text-${link.color}-500`];
}

function navigate(link: string) {
    menuOpen.value = false;
    navigateTo(link);
}
</script>

<style lang="postcss" scoped>
.MenuOverlay {
    @apply w-full h-full bg-darkPurple-900 bg-opacity-70 fixed top-0 left-0 z-10;
}

.MenuWrapper {
    @apply fixed top-0 left-0 w-80 min-h-full bg-darkPurple-900 z-20 drop-shadow-md duration-300 transition-all;
}

.menuContainer {
    @apply mt-8;
}

.menuLink {
    @apply w-full flex px-6 py-2 gap-3 flex-wrap place-items-center text-lg cursor-pointer hover:bg-darkPurple-800 duration-300 text-gray-400;
}

.menuLink.home {
    @apply text-gray-50 font-bold;
}

.menuTitle {
    @apply text-lg font-bold px-6 py-2;
}

.menuLink .icon {
    @apply text-2xl;
}

.menuOpenStyle {
    @apply border-r-2 border-darkPurple-700;
}

.menuOpenStyle .menuLink {
    @apply opacity-100;
}

.menuClosedStyle .menuLink {
    @apply opacity-0 -translate-x-80;
}

.menuClosedStyle {
    @apply -translate-x-80;
}

.menuContainer hr {
    @apply border border-darkPurple-700 mx-6 my-4;
}
</style>
