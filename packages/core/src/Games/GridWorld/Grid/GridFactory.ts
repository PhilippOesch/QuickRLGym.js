import seedrandom from 'seedrandom';
import Grid, { FieldType, GridField } from './Grid';
import { Vec2 } from '@root/Utils';

/**
 * The Taxi Game class
 * @category Games
 * @subcategory GridWorld
 */
class GridFactory {
    private static readonly chanceForAWall: number = 0.1;
    private static readonly chanceForNegativeRewardField: number = 0.05;
    private static readonly chanceForBonusField: number = 0.02;
    private static readonly negativeReward: number = -1;
    private static readonly goalReward: number = 5;
    private static readonly bonusFieldReward: number = 1;
    private static readonly relativeGoalRange: number = 0.4;

    /**
     * Create a new grid.
     * @param {number} size The size of the grid.
     * @param {seedrandom.PRNG} rng The random number generator.
     * @param {Vec2} startingPos The starting position.
     * @returns {Grid} a new grid.
     */
    public create(size: number, rng: seedrandom.PRNG, startingPos: Vec2): Grid {
        let [rawGrid, goal] = this.generateGrid(size, rng);
        let grid = new Grid(rawGrid, startingPos, goal);

        while (!this.goalIsReachable(grid, startingPos)) {
            [rawGrid, goal] = this.generateGrid(size, rng);
            grid = new Grid(rawGrid, startingPos, goal);
        }

        return grid;
    }

    /**
     * Generates the grid.
     * @param {number} size The size.
     * @param {seedrandom.PRNG} rng The random number generator.
     * @returns {GridField[][]} A filled 2D GridField Array.
     */
    private generateGrid(
        size: number,
        rng: seedrandom.PRNG
    ): [GridField[][], Vec2] {
        const rawGrid: GridField[][] = new Array<GridField[]>(size);
        for (let y = 0; y < size; y++) {
            rawGrid[y] = new Array<GridField>(size);
            for (let x = 0; x < size; x++) {
                rawGrid[y][x] = this.getNewField(rng, new Vec2(x, y));
            }
        }

        const goal = this.generateGoalPosition(rawGrid, rng);
        return [rawGrid, goal.position];
    }

    /**
     * Generate a random grid field.
     * @param {seedrandom.PRNG} rng The random number generator.
     * @param {Vec2} vec the position of the field
     * @returns {GridField} a new random field.
     */
    private getNewField(rng: seedrandom.PRNG, vec: Vec2): GridField {
        let randNum = rng();

        // generate wall
        if (randNum < GridFactory.chanceForAWall) {
            return {
                position: vec,
                reward: 0,
                type: FieldType.Wall,
            };
        }

        randNum = rng();

        // generate negative value Field

        if (randNum < GridFactory.chanceForNegativeRewardField) {
            return {
                position: vec,
                reward: GridFactory.negativeReward,
                type: FieldType.NegativeField,
            };
        } else if (
            randNum <
                GridFactory.chanceForNegativeRewardField +
                    GridFactory.chanceForNegativeRewardField &&
            randNum > GridFactory.chanceForNegativeRewardField
        ) {
            return {
                position: vec,
                reward: GridFactory.bonusFieldReward,
                type: FieldType.BonusField,
            };
        }

        return {
            position: vec,
            reward: 0,
            type: FieldType.Normal,
        };
    }

    /**
     * Generate the goal position
     * @param {GridField[][]} grid The grid.
     * @param {seedrandom.PRNG} rng The random number generator.
     * @returns {void}
     */
    private generateGoalPosition(
        grid: GridField[][],
        rng: seedrandom.PRNG
    ): GridField {
        const randNumX = rng();
        const randNumY = rng();

        const range = grid.length * GridFactory.relativeGoalRange;
        const max = Math.ceil(grid.length - (grid.length - range) / 2);
        const min = Math.floor((grid.length - range) / 2);
        const x = Math.floor(randNumX * (max - min + 1)) + min;
        const y = Math.floor(randNumY * (max - min + 1)) + min;

        const goal = {
            position: new Vec2(x, y),
            reward: GridFactory.goalReward,
            type: FieldType.EndState,
        };

        grid[y][x] = goal;
        return goal;
    }

    /**
     * Apply Breadth-first-search algorithm to find out whether the goal is reachable
     * @param {GridField[][]} grid The grid.
     * @param {Vec2} startingPos The starting position.
     * @returns {boolean} Whether the goal is reachable.
     */
    private goalIsReachable(grid: Grid, startingPos: Vec2): boolean {
        // bfs algorithm

        const queue: GridField[] = [];
        queue.push(grid.getField(startingPos));

        const visited: Set<string> = new Set([startingPos.key]);

        let found = false;

        while (queue.length > 0 && !found) {
            const value: GridField = queue.pop()!;

            const neighbors = grid.getNeighbors(value.position);

            for (const neighbor of neighbors) {
                if (!visited.has(neighbor.position.key)) {
                    if (neighbor.type === FieldType.EndState) {
                        found = true;
                        break;
                    }

                    queue.push(neighbor);
                    visited.add(neighbor.position.key);
                }
            }
        }

        return found;
    }
}

export default GridFactory;
