<template>
    <div class="mainContainer">
        <h1 class="title">Select A Game</h1>
        <div class="gameSelectContainer">
            <template v-for="link in links" :key="link.link">
                <NuxtLink class="linkButton bg-slate-600" :to="link.link">
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
<script setup lang="ts">
const links = [
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
    //     link: '/Games/Taxi',
    //     description: 'A Grid World Implementation',
    //     icon: 'grid',
    //     color: IconColor.Sky,
    // },
    // {
    //     title: 'Tic-Tac-Toe',
    //     link: '/Games/BlackJack',
    //     description: 'Standard Tic-Tac-Toe Implementation',
    //     icon: 'tic-tac-toe',
    //     color: IconColor.Pink,
    // },
];

function setClasses(link: any) {
    return ['icon', 'quickrl-' + link.icon, `text-${link.color}-500`];
}
</script>

<style lang="postcss" scoped>
.gameSelectContainer {
    @apply mt-8 grid grid-cols-1 gap-[2px] rounded-md drop-shadow lg:grid-cols-2;
}

.linkButton {
    @apply flex bg-darkPurple-800 bg-opacity-100 px-6 py-6 text-lg first:rounded-t-md last:rounded-b-md hover:bg-darkPurple-700 lg:first:rounded-tr-none lg:last:rounded-bl-none;
    @apply bg-darkPurple-800;
}
/* .linkButton {
    @apply block bg-slate-600;
} */

.icon {
    @apply mr-4 grid justify-center align-middle text-5xl;
}

h2 {
    @apply text-xl;
}
p {
    @apply mt-1 text-sm;
}

.linkButton:nth-child(2) {
    @apply lg:rounded-tr-md;
}

.linkButton:nth-last-child(2) {
    @apply lg:rounded-bl-md;
}
</style>
