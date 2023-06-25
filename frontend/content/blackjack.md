## Overview

The goal in blackjack is to beat the dealer by obtaining cards with the a value as close to 21 as possible without going over. When the player get's closer to 21 than the dealer.

> **_NOTE:_** The Black Jack implementation is oriented on the logic described in [Richard S. Sutton and Andrew G. Barto 'Reinforcement Learning: An Introduction'](https://www.amazon.de/-/en/Richard-S-Sutton/dp/0262193981) Example 5.1..

## Description

### Start of the Game

At the start of the game the player an the dealer each get 2 cards. One card of the dealers cards is facing up. Both cards of the player are facing up.

### Card Values

There are three types of cards:

- The Face cards *Jack*, *Queen*, and *King* all have a value of 10.
- The Numeric cards 2-9 have a value equal to the displayed number.
- The *Ace* which can be values as 11 points, in which case it is called a usable ace, or as 1 point.

### Gameplay

The player can get additional cards which is called to hit. Or, when the player thinks they have received enougth cards they can call stick in which case they will receive no additional cards. After the player called stick, the dealer will reviel the faced down card. The dealer then will draw cards until the value of cards is equal to or exceeds 17.

When the player is close to the value of 21 compared to the dealer they win. In case the player excedes the value of 21 they lose. When both dealer and player have the same amount of points there is a draw. In all other cases the dealer wins.

## Action Space

There are two actions, **stick** (action=0), and **hit** (action=1).

## Observation Space

 | Dimension | Size | Description                           |
 | --------- | ---- | ------------------------------------- |
 | 0         | 4-∞  | The current sum of the players cards  |
 | 1         | 1-10 | The one showing card of the dealer    |
 | 2         | 0-1  | Whether the player holds a usable ace |

 ## Rewards

 - Game Won: 1.
 - Game Lost: -1.
 - Draw: 0.