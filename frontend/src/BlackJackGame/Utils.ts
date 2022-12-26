import { BlackJackCard } from '../../../shared/src/Games/BlackJack';

module BlackJackUtils {
    export function getTotalCardSet(): Set<string> {
        let cardSet: Set<string> = new Set();
        for (const suit of BlackJackCard.suits) {
            for (const rank of BlackJackCard.ranks) {
                cardSet.add(`${suit}-${rank}`);
            }
        }
        return cardSet;
    }
}

export default BlackJackUtils;
