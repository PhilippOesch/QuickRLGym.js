<template>
    <div class="mainContainer">
        <h1 class="title">Select A Game</h1>
        <div class="gameSelectContainer">
            <!-- <NuxtLink class="linkButton" to="/Games/TaxiGame"
                >Taxi Game</NuxtLink
            >
            <NuxtLink class="linkButton" to="/Games/BlackJackGame"
                >BlackJack</NuxtLink
            > -->
            <template v-for="link in links" :key="link.link">
                <NuxtLink class="linkButton" :to="link.link">
                    <i :class="setClasses(link)" :alt="link.title" />
                    <div class="rightSide">
                        <h2>{{ link.title }}</h2>
                        <p>{{ link.description }}</p>
                    </div>
                </NuxtLink>
            </template>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { IconColor } from '~~/utils/enums';

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
                    description: 'Game Based on the Taxi Problem',
                    icon: 'car',
                    color: IconColor.Amber,
                },
                {
                    title: 'Blackjack',
                    link: '/Games/BlackJack',
                    description: 'Basic Implementation of Blackjack',
                    icon: 'card',
                    color: IconColor.Green,
                },
                // {
                //     title: 'Grid World',
                //     link: '/Games/TaxiGame',
                //     description: 'A Grid World Implementation',
                //     icon: 'grid',
                //     color: IconColor.Sky,
                // },
                // {
                //     title: 'Tic-Tac-Toe',
                //     link: '/Games/BlackJackGame',
                //     description: 'Standard Tic-Tac-Toe Implementation',
                //     icon: 'tic-tac-toe',
                //     color: IconColor.Pink,
                // },
            ],
        };
    },
    methods: {
        setClasses(link: any) {
            return ['icon', 'quickrl-' + link.icon, link.color];
        },
    },
});
</script>

<style lang="postcss" scoped>
.gameSelectContainer {
    @apply mt-8 grid lg:grid-cols-2 grid-cols-1 gap-[2px] bg-zinc-900 rounded-md drop-shadow;
}

.linkButton {
    @apply first:rounded-t-md 
        lg:first:rounded-tr-none 
        last:rounded-b-md 
        lg:last:rounded-bl-none 
        px-6 py-6 text-lg
        bg-gray-800 
        hover:bg-gray-700
        flex;
}

.icon {
    @apply text-5xl mr-4 grid justify-center align-middle;
}

h2 {
    @apply text-xl;
}
p {
    @apply text-sm mt-1;
}

.linkButton:nth-child(2) {
    @apply lg:rounded-tr-md;
}

.linkButton:nth-last-child(2) {
    @apply lg:rounded-bl-md;
}
</style>
