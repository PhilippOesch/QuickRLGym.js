import GameObject from "../interfaces/GameObject";
import GameScene from "./GameScene";

export default class GameScoreUI extends GameObject {
    private static destMapping: string[] = ["red", "yellow", "green", "blue"];

    private uidata: Phaser.GameObjects.Text;

    constructor(scene: GameScene) {
        super(scene);
    }

    public preload(): void {}
    public create(): void {
        this.uidata = this.scene.add.text(0, 0, "", {
            font: "20px Courier",
            color: "#00ff00",
        });
        this.uidata.setDataEnabled();
        this.uidata.setScale(1, 1);

        this.uidata.data.set("points", 0);
        this.uidata.data.set("iterations", 0);
        this.uidata.data.set("destination", "none");

        this.uidata.setText([
            "Points: " + this.uidata.data.get("points"),
            "Iteration: " + this.uidata.data.get("iterations"),
            "Destination: " + this.uidata.data.get("destination"),
        ]);

        this.uidata.on("changedata-points", () => {
            this.updateText();
        });

        this.uidata.on("changedata-iterations", () => {
            this.updateText();
        });
        this.uidata.on("changedata-destination", () => {
            this.updateText();
        });
    }

    public updateText(): void {
        this.uidata.setText([
            "Points: " + this.uidata.data.get("points"),
            "Iteration: " + this.uidata.data.get("iterations"),
            "Destination: " + this.uidata.data.get("destination"),
        ]);
    }

    public incrementIterations(): void {
        this.uidata.data.values.iterations++;
    }

    public updatePoints(pointDifferential: number) {
        this.uidata.data.values.points += pointDifferential;
    }

    public setDestination(index: number): void {
        this.uidata.data.values.destination = GameScoreUI.destMapping[index];
    }

    public resetGameState() {
        this.uidata.data.values.points = 0;
        this.uidata.data.values.iterations = 0;
    }
}
