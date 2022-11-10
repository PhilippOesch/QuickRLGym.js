# RL Taxi World

This is a Training project I did to refine Reinforcement Learning Concept. 
For this goal i implemented the Taxi Problem introduced by Tom Dietterich, see [here](https://www.jair.org/index.php/jair/article/view/10266).
The Implementation is also oriented on the Taxi Problem implementation in [OpenAIGym](https://www.gymlibrary.dev/environments/toy_text/taxi/)

The game logic is abstracted in an OOP manner seen in [./src/game/](./src/game/). There also is a possibility to render the game for which [Phaser](https://phaser.io/) was used.
Further goals are to implement an abstraction that can be used for the training of Reinforcement Learning Model and train RL-Algorithms on the game.
This repository may also serve as learning source for other to get into RL-Learning.

## Roadmap:

- [x] Implement Game Abstraction
- [x] Render Game
- [x] Conceptialize RL-Interface
- [ ] Implement Q-Learning
- [ ] Implement DQN
- [ ] ...

Stack:

- (Vite.js)[https://vitejs.dev/] - For quick and easy development.
- (Phaser)[https://phaser.io/] - Well supported 2d browser engine.
- (seedrandom)[https://github.com/davidbau/seedrandom] - Allowes to set random seeds for random number generation.