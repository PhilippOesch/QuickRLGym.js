<template>
    <div class="mainContainer">
        <h1 class="title">Select A Game</h1>
        <div class="gameSelectContainer">
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
    {
        title: 'Grid World',
        link: '/Games/Taxi',
        description: 'A Grid World Implementation',
        icon: 'grid',
        color: IconColor.Sky,
    },
    {
        title: 'Tic-Tac-Toe',
        link: '/Games/BlackJack',
        description: 'Standard Tic-Tac-Toe Implementation',
        icon: 'tic-tac-toe',
        color: IconColor.Pink,
    },
];

function setClasses(link: any) {
    return ['icon', 'quickrl-' + link.icon, `text-${link.color}-500`];
}
</script>

<style lang="postcss" scoped>
.gameSelectContainer {
    @apply mt-8 grid lg:grid-cols-2 grid-cols-1 gap-[2px] rounded-md drop-shadow;
}

.linkButton {
    @apply first:rounded-t-md 
        lg:first:rounded-tr-none 
        last:rounded-b-md 
        lg:last:rounded-bl-none 
        px-6 py-6 text-lg
        bg-darkPurple-800 
        hover:bg-darkPurple-700
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
