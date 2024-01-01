import './style.css'
import Phaser from 'phaser'

const sizes = {
  width: 600,
  height: 600
};

const speedDown = 500;

class GameScene extends Phaser.Scene {
  constructor() {
    super("scene-game");
    this.player;
    this.cursor;
    this.playerSpeed = speedDown + 50;
    this.isJumping = false;
    this.jumpForce = -400;
  }

  preload() {
    this.load.image("bg", "/assets/background.png");
    // Replace 'player-spritesheet' with your sprite sheet file
    this.load.spritesheet('player', '/assets/spritesheet.png', {
      frameWidth: 185, // Update with your sprite's frame width
      frameHeight: 147, // Update with your sprite's frame height
    });
    this.load.image("Hawk", "/assets/Hawk1.svg");
  }

  create() {
    this.add.image(0, 0, "bg").setOrigin(0, 0);

    // Use sprite instead of image for player to have animations
    this.player = this.physics.add.sprite(0, sizes.height - 100, "player").setOrigin(0, 0).setScale(.6);
    this.player.setImmovable(true);
    this.player.body.allowGravity = true;
    this.player.setCollideWorldBounds(true);

    // Create the walking animation
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }), // Adjust frame range
      frameRate: 9,
      repeat: -1
    });

    this.add.image(0, 0, "Hawk").setOrigin(0, 0);
    this.cursor = this.input.keyboard.createCursorKeys();
  }

  update() {
    const { left, right, up } = this.cursor;
    let moving = false;

    if (left.isDown) {
      this.player.setVelocityX(-this.playerSpeed);
      this.player.flipX = true;
      moving = true;
    } else if (right.isDown) {
      this.player.setVelocityX(this.playerSpeed);
      this.player.flipX = false;
      moving = true;
    } else {
      this.player.setVelocityX(0);
    }

    if (up.isDown && !this.isJumping) {
      this.player.setVelocityY(this.jumpForce);
      this.isJumping = true;
      console.log(this.isJumping);
    }

    if (this.player.body.touching.down) {
      this.isJumping = false;
      console.log(this.isJumping);
    }

    // Play or stop the walking animation
    if (moving) {
      this.player.anims.play('walk', true);
    } else {
      this.player.anims.stop();
      this.player.setFrame(0); // Or another frame that represents standing still
    }
  }
}

const config = {
  type: Phaser.WEBGL,
  width: sizes.width,
  height: sizes.height,
  canvas: gameCanvas,
  physics: {
    default: "arcade",
    arcade: {
      gravity: { y: speedDown },
      debug: false // Set to false if you don't want physics debug visuals
    }
  },
  scene: [GameScene]
};

const game = new Phaser.Game(config);
