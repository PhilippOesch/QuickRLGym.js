import { BlackJackAction } from './Action';

export default class BlackJackGame {
    public static readonly actionMapping: Map<string, BlackJackAction> =
        new Map([
            ['Stick', BlackJackAction.Stick],
            ['Hit', BlackJackAction.Hit],
        ]);
}
