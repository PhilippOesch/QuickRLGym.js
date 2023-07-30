import { QuickRlIcon } from '../types';
import { Enums } from '../types';

export type CardLink = {
    title: string;
    link: string;
    description: string;
    icon: QuickRlIcon;
    color: Enums.IconColor;
};

const gameLinks: CardLink[] = [
    {
        title: 'Taxi Game',
        link: '/Games/Taxi',
        description: 'Game Based on the Taxi Problem',
        icon: 'car',
        color: Enums.IconColor.Amber,
    },
    {
        title: 'Blackjack',
        link: '/Games/BlackJack',
        description: 'Basic Implementation of Blackjack',
        icon: 'card',
        color: Enums.IconColor.Green,
    },
    {
        title: 'Grid World',
        link: '/Games/GridWorld',
        description: 'Implementation of a Grid World Problem',
        icon: 'grid',
        color: Enums.IconColor.Sky,
    },
];

export default gameLinks;
