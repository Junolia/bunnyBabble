import './style.css'
import Phaser from 'phaser'

//GLOBAL VARIABLES
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
    //Game background
    this.load.image("bg", "/assets/background.png");
    this.load.image("floor", "/assets/floor.png");
    //Characters
    this.load.spritesheet('player', '/assets/spritesheet.png', {
      frameWidth: 185, 
      frameHeight: 147,
    });

    //todo: Will eventually be a spritesheet
    this.load.image("Hawk", "/assets/Hawk1.svg");
  }

  create() {
    //-----------BACKGROUND CONFIGS-----------------// 
    this.add.image(0, 0, "bg").setOrigin(0, 0);
    let ground = this.physics.add.sprite(0, sizes.height / 2, "floor");
    //size the ground
    ground.displayWidth = this.sys.game.config.width;
    ground.displayHeight = 15;
    //make the ground stay in place
    ground.setImmovable(true);
    

    //-----------BUNNY CONFIGS-----------------// 
    this.player = this.physics.add.sprite(0, sizes.height - 400, "player").setOrigin(0, 0).setScale(.6);
    //this.player.setImmovable(true);
    this.player.body.allowGravity = true;
    

    // Animation
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 2 }), // Adjust frame range
      frameRate: 9,
      repeat: -1
    });
  
    //-----------HAWK CONFIGS-----------------// 
    this.add.image(0, 0, "Hawk").setOrigin(0, 0);
    this.cursor = this.input.keyboard.createCursorKeys();

    //-----------COLLIDERS-----------------// 
    this.physics.add.collider(this.player, ground);
    ground.setCollideWorldBounds(true);
    this.player.setCollideWorldBounds(true);
  }

  update() {
    const {left, right, space} = this.cursor;
    let moving = false;

    //Check for movement input
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

    if (space.isDown && !this.isJumping) {
      this.player.setVelocityY(this.jumpForce);
      this.isJumping = true;
      //console.log(this.isJumping);

      this.player.setFrame(1);
    }

    if (this.player.body.touching.down) {
      this.isJumping = false;
      //console.log(this.isJumping);
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
      debug: true // Set to false if you don't want physics debug visuals
    }
  },
  scene: [GameScene]
};

const game = new Phaser.Game(config);
