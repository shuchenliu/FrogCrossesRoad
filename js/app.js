// GOLOBAL CONSTANTS
const ENEMY_SPEED_BASE = 100;
const ENEMY_FREQUENCY = 600;
const yUnit = 80;
const xUnit = 100;

// Utility function

const randomIntegerBetweenInclusive = (min, max) => {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}



// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
    this.x = randomIntegerBetweenInclusive(-150, -5);
    this.y = 60 + 80 * randomIntegerBetweenInclusive(0,2);
    this.speed = ENEMY_SPEED_BASE * randomIntegerBetweenInclusive(1, 3)
};

// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
    this.x += dt * this.speed;
};

// Draw the enemy on the screen, required method for game
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

class Player {
    constructor() {
      this.sprite = 'images/char-boy.png';
    }

    respawn() {
      this.x = 0 + 100 * randomIntegerBetweenInclusive(0,1);
      this.y = 60 + 80 * randomIntegerBetweenInclusive(3,4);
      this.xDir = 0;
      this.yDir = 0;
    }
    render() {
      ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    update() {
      let x = this.x + this.xDir;
      let y = this.y + this.yDir;

      // check boundries
      if (x < 0) {
        x = 0;
      } else if (x > 400) {
        x = 400;
      }

      if (y < 0) {
        y = 0;
      } else if (y > 380) {
        y = 380;
      }

      //update coordinates
      this.x = x;
      this.y = y;

      //reset directional vector
      this.xDir = 0;
      this.yDir = 0;
    }

    handleInput(dir) {
    //  console.log(dir);
      let a = 0, b = 0;

      switch(dir) {
        case 'up':
          b = -yUnit
          break;
        case 'down':
          b = yUnit
          break;
        case 'left':
          a = -xUnit
          break;
        case 'right':
          a = xUnit
          break;
      }
      this.xDir = a;
      this.yDir = b;
    }
}


// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
let allEnemies = [];
let enemyHandle;


const setEnemies = () => {
  enemyHandle = setInterval(() => {
    allEnemies.push(new Enemy());
  },ENEMY_FREQUENCY);
  console.log(enemyHandle);
}

setEnemies();
const player = new Player();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    if (allowedKeys[e.keyCode] === undefined) {
      return;
    }
    player.handleInput(allowedKeys[e.keyCode]);
});
