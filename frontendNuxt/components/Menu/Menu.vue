<template>
    <MenuButton :clickHandler="toggleMenu"></MenuButton>
    <div v-if="menuOpen" class="MenuWrapper">
        <div class="menuContainer">
            <NuxtLink class="menuLink" to="/">
                <i class="icon quickrl-home" alt="Home" />
                <div class="rightSide">
                    <span>Home</span>
                </div>
            </NuxtLink>
            <template v-for="link in links" :key="link.link">
                <NuxtLink class="menuLink" :to="link.link">
                    <i :class="setClasses(link)" :alt="link.title" />
                    <div class="rightSide">
                        <span>{{ link.title }}</span>
                    </div>
                </NuxtLink>
            </template>
        </div>
    </div>
    <div v-if="menuOpen" class="MenuOverlay" @click="toggleMenu"></div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';

export default defineComponent({
    setup() {
        return {};
    },
    data() {
        return {
            links: [
                {
                    title: 'Taxi Game',
                    link: '/Games/Taxi',
                    icon: 'car',
                    color: IconColor.Amber,
                },
                {
                    title: 'Blackjack',
                    link: '/Games/BlackJack',
                    icon: 'card',
                    color: IconColor.Green,
                },
                {
                    title: 'Grid World',
                    link: '/Games/TaxiGame',
                    icon: 'grid',
                    color: IconColor.Sky,
                },
                {
                    title: 'Tic-Tac-Toe',
                    link: '/Games/BlackJackGame',
                    icon: 'tic-tac-toe',
                    color: IconColor.Pink,
                },
            ],
            menuOpen: false,
        };
    },
    methods: {
        toggleMenu() {
            this.menuOpen = !this.menuOpen;
        },
        setClasses(link: any) {
            return ['icon', 'quickrl-' + link.icon, link.color];
        },
    },
});
</script>

<style lang="postcss" scoped>
.MenuOverlay {
    @apply w-full h-full bg-black bg-opacity-50 fixed top-0 left-0 z-10;
}

.MenuWrapper {
    @apply fixed top-0 left-0 min-w-max w-96 min-h-full bg-gray-900 z-20 drop-shadow-md border-gray-500;
}

.menuContainer {
    @apply mt-8;
}

.menuLink {
    @apply min-w-full flex px-5 py-3 gap-3 flex-wrap place-items-center text-xl cursor-pointer hover:bg-gray-800;
}

.menuLink .icon {
    @apply text-4xl;
}
</style>
