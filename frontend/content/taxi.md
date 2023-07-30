## Overview

The goal in this environment is for the taxi to pick up the customer from a starting point and to bring them to the correct destination.

> **_NOTE:_** This Game environment is based on ["Hierarchical Reinforcement Learning with the MAXQ Value Function Decomposition"](https://arxiv.org/abs/cs/9905014) by Thomas G. Dietterich.
> 
## Description

At the start of the game the taxi and the customer each start from a random of the colored positions (red, gree, yellow, blue). The taxi driver has to pick up the customer and then has to bring them to the predefined colored designation (red, gree, yellow, blue). 

The game ends when the customer has been dropped of at the correct position, or the maximum of moves (25) has been reached.

## Action Space

The Taxi driver can select the following Actions:

- `Up`(0) - Move Up
- `Down`(1) - Move Down
- `Left`(2) - Move Left
- `Right`(3) - Move Right
- `Pickup`(4) - Pick up Customer
- `DropOff`(5) - Drop Off Customer

## Observation Space

 | Dimension | Range       | Description                                                          |
 | --------- | ----------- | -------------------------------------------------------------------- |
 | 0         | `(int)` 0-4 | The current taxis x position.                                        |
 | 1         | `(int)` 0-4 | The current taxis y position.                                        |
 | 2         | `(int)` 0-3 | The prededfined designation position.                                |
 | 4         | `(int)` 0-4 | The customers position (0-3 - designation position, 4 - in the taxi) |

 ## Rewards

 - *Move Penalty*: -1.
 - *Illegal Move Penalty*: -10.
 - *DropOff Customer*: 20.