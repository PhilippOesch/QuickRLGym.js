import { Games } from 'quickrl.core';

module BlackJackUtils {
    export function getTotalCardSet(): Set<string> {
        let cardSet: Set<string> = new Set();
        for (const suit of Games.BlackJack.BlackJackCard.suits) {
            for (const rank of Games.BlackJack.BlackJackCard.ranks) {
                cardSet.add(`${suit}-${rank}`);
            }
        }
        return cardSet;
    }
}

export default BlackJackUtils;
