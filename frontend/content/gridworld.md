## Overview

This is a simple implementation of a grid world. There is a grid, there is a player and there is a world with food, evil plants and a goal for the player to reach.

## Description

The player starts at a random position in the grid and has to reach the goal. They can move one step up, down, left or right. On the way the player can encounter walls, food which will increase the point counter, and carnivorous plants which will make you lose points. 

## Grid Field Types

- **Wall**: Player can't move through this. Trying to do this will result with an illegal Move.
- **Normal Field**: The player is allowed to travers this. Nothing interesting here.
- **Food**: The player will gain extra points.
- **Carnivorus Plant**: The player will lose points.
- **Goal**: The player has reached the end and the game is won.

## Action Space

- `Up`(0) - Move Up
- `Down`(1) - Move Down
- `Left`(2) - Move Left
- `Right`(3) - Move Right

## Observation Space

 | Dimension | Range        | Description                     |
 | --------- | ------------ | ------------------------------- |
 | 0         | `(int)` 0-10 | The current players x position. |
 | 1         | `(int)` 0-10 | The current players y position. |

 ## Rewards

- *Reach Goal*: 5.
- *Illegal Move*: -10.
- *Food*: 1.
- *Carnivorus Plant*: -1.