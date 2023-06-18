import seedrandom from 'seedrandom';
import Grid, { FieldType, GridField } from './Grid';
import { Vec2 } from 'src/Utils';

class GridFactory {
    private static readonly chanceForAWall: number = 0.1;
    private static readonly chanceForNegativeRewardField: number = 0.05;
    private static readonly negativeReward: number = -1;
    private static readonly goalReward: number = 1;
    private static readonly relativeGoalRange: number = 0.4;

    public create(size: number, rng: seedrandom.PRNG, startingPos: Vec2): Grid {
        let rawGrid = this.generateGrid(size, rng, startingPos);
        let startingField = rawGrid[startingPos.y][startingPos.x];

        while (!this.goalIsReachable(rawGrid, startingField)) {
            rawGrid = this.generateGrid(size, rng, startingPos);
            startingField = rawGrid[startingPos.y][startingPos.x];
        }
        return new Grid(rawGrid);
    }

    private generateGrid(
        size: number,
        rng: seedrandom.PRNG,
        startigPos: Vec2
    ): GridField[][] {
        const rawGrid: GridField[][] = new Array<GridField[]>(size);
        for (let y = 0; y < size; y++) {
            rawGrid[y] = new Array<GridField>(size);
            for (let x = 0; x < size; x++) {
                if (!this.fieldIsPotentialStartingPoint(x, y, size)) {
                    rawGrid[y][x] = this.getNewField(rng, new Vec2(x, y));
                }
            }
        }

        this.generateGoalPosition(rawGrid, rng, size);
        return rawGrid;
    }

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
                type: FieldType.Normal,
            };
        }

        return {
            position: vec,
            reward: 0,
            type: FieldType.Normal,
        };
    }

    private generateGoalPosition(
        grid: GridField[][],
        rng: seedrandom.PRNG,
        size: number
    ): void {
        const randNumX = rng();
        const randNumY = rng();

        const range = size * GridFactory.relativeGoalRange;
        const max = Math.ceil(size - (size - range) / 2);
        const min = Math.floor((size - range) / 2);
        const x = Math.floor(randNumX * (max - min + 1)) + min;
        const y = Math.floor(randNumY * (max - min + 1)) + min;

        const goal = {
            position: new Vec2(x, y),
            reward: GridFactory.goalReward,
            type: FieldType.EndState,
        };

        grid[y][x] = goal;
    }

    private fieldIsPotentialStartingPoint(x: number, y: number, size: number) {
        return (
            (x == 0 && y == 0) ||
            (x == 0 && y == size - 1) ||
            (x == size - 1 && y == 0) ||
            (x == size - 1 && y == size - 1)
        );
    }

    private goalIsReachable(
        grid: GridField[][],
        startingPos: GridField
    ): boolean {
        // bfs algorithm

        const queue: GridField[] = [];
        queue.push(startingPos);

        const visited: Set<string> = new Set([startingPos.position.key]);

        let found = false;

        while (queue.length > 0 && !found) {
            const value: GridField = queue.pop()!;

            const neighbors = this.getNeighbors(value.position, grid);

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

    private getNeighbors(vec: Vec2, grid: GridField[][]): GridField[] {
        const neighbors: GridField[] = [];

        const neighborVectors: Vec2[] = [
            new Vec2(vec.x + 1, vec.y),
            new Vec2(vec.x - 1, vec.y),
            new Vec2(vec.x, vec.y + 1),
            new Vec2(vec.x, vec.y - 1),
        ];

        for (const vector of neighborVectors) {
            if (
                this.insideBorders(vector, grid.length) &&
                !this.isWall(grid, vector)
            ) {
                neighbors.push(grid[vector.y][vector.x]);
            }
        }

        return neighbors;
    }

    private isWall(grid: GridField[][], vec: Vec2): boolean {
        return grid[vec.y][vec.x].type === FieldType.Wall;
    }

    private insideBorders(vec: Vec2, size: number): boolean {
        return !(vec.x >= 0 && vec.x < size && vec.y >= 0 && vec.y < size);
    }
}

export default GridFactory;
