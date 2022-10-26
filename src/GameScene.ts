import 'phaser'

export default class GameScene extends Phaser.Scene {
    constructor ()
    {
        super('demo');
    }

    preload(): void {
        this.load.image('sky', 'assets/sky.png');
        this.load.image('logo', 'assets/phaser3-logo.png');
        this.load.image('star', 'assets/star.png');
    }

    create(): void {
        this.add.image(400,300, 'sky')

        const particles: Phaser.GameObjects.Particles.ParticleEmitterManager= this.add.particles('star');

        const emitter: Phaser.GameObjects.Particles.ParticleEmitter = particles.createEmitter({
            speed: 100,
            scale: {
                start: 1,
                end: 0
            },
            blendMode: 'ADD'
        });

        const logo: Phaser.Types.Physics.Arcade.ImageWithDynamicBody= this.physics.add.image(400,100, 'logo');

        logo.setVelocity(100, 200);
        logo.setBounce(1, 1);
        logo.setCollideWorldBounds(true);
        emitter.startFollow(logo);

    }
}