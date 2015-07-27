// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances.
	
	/* Draw all enemies to the left of the canvas (x-position).
	 * Define the y-position variable and the speed variable.
	 */
	this.x = -101;
	this.y;
	this.speed;
	
    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
}


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.
	
	// Check player.state if game is running or paused.
	if (player.state === 'go') {
		// Move the enemies along the screen with the set speed and time delta.
		this.x += this.speed * dt;
	}
	
	/* If an enemy moves off the screen on the right, reset it
	 * to the left.
	 */
	if (this.x > 505){
		this.x = -101;
	}

}


// Draw the enemy on the screen, required method for game.
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
}


// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
	// Starting point for the player.
	this.x = 202;
	this.y = 404;
	
	// Variables for game state and player lives.
	this.state = 'start';
	this.lives = 5;
	
	// Image for the player, using the provided helper.
	this.sprite = 'images/char-boy.png';
}


// update() method for the player
Player.prototype.update = function() {
	/* Collision detection using circles.
	 * The basic algorithm is described here: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
	 * To check collision against all enemies, the detection is within a for-loop.
	 */
	var len = allEnemies.length;
	
	for (var k = 0; k < len; k++) {
		/* Calculation of x and y position for centre of player circle,
		 * to place the circle tight around the visible player.
		 * Setting a circle radius of 40.
		 */
		var playerCenterX = this.x + 50;
		var playerCenterY = this.y + 105;
		var playerRadius = 40;
		
		/* The calculations for the circle centre of enemy.
		 * Using a radius of 32.
		 */
		var enemiesCenterX = allEnemies[k].x + 50;
		var enemiesCenterY = allEnemies[k].y + 108;
		var enemiesRadius = 32;
		
		/* Calculating the distance between the centre of the player and 
		 * the centre of the enemy.
		 */
		var dx = enemiesCenterX - playerCenterX;
		var dy = enemiesCenterY - playerCenterY;
		var distance = Math.sqrt(dx * dx + dy * dy);
		
		/* The actual collision detection: If the distance between the centres
		 * is smaller then the sum of the defined radii, there is a collision.
		 */
		if (distance < (playerRadius + enemiesRadius)) {
			// Reset the player to the starting position.
			this.x = 202;
			this.y = 404;
			this.lives -= 1;
			this.gameStates();
		}
	}
	
	// Checking if the player has reached the water and won.
	if (this.y < 0) {
		this.state = 'won';
	}
	
	// Checking if the player has lost all his lives.
	if (this.lives < 1) {
		this.x = 202;
		this.y = 404;
		this.state = 'lost';
	}
}

// render() method - to draw the player on the screen.
Player.prototype.render = function() {
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	this.gameStates();
}


// handleInput() method - to move the player.
Player.prototype.handleInput = function(key) {
	// Check player.state to start or pause game.
	if (key === 'space') {
		if (this.state === 'go') {
		this.state = 'stop';
		} else if (this.state === 'won'){
			this.x = 202;
			this.y = 404;
			this.state = 'go';
		} else {
			this.state = 'go';
		}
	} else if (this.state === 'go') {
		// Switch - see which kind of input and move the player.
		switch (key) {
			case 'left':
				if (this.x > 0) {
					this.x -= 101;
				};
				break;
			case 'up':
				if (this.y > 0) {
					this.y -= 83;
				};
				break;
			case 'right':
				if (this.x < 404) {
					this.x += 101;
				};
				break;
			case 'down':
				if (this.y < 404) {
					this.y += 83;
				};
				break;
			default: 
				break;
		}
	}
}

Player.prototype.gameStates = function(){
	ctx.font = '22px sans-serif';
	ctx.textBaseline = 'top';
	ctx.fillStyle = 'rgba(255,255,255,0.5)';
	
	switch (this.state) {
		case 'stop':
			ctx.fillRect(0, 214, 505, 85);
			ctx.fillStyle = '#333';
			ctx.fillText('Press space to continue the game', 101, 238);
			break;
		case 'start':
			ctx.fillRect(0, 214, 505, 85);
			ctx.fillStyle = '#333';
			ctx.fillText('Press space to start and pause the game', 55, 238);
			break;
		case 'won':
			ctx.fillRect(0, 214, 505, 85);
			ctx.fillStyle = '#333';
			ctx.fillText('Won', 202, 238);
			this.lives = 5;
			break;
		case 'lost':
			ctx.fillRect(0, 214, 505, 85);
			ctx.fillStyle = '#333';
			ctx.fillText('Lost', 202, 238);
			this.lives = 5;
			break;
		case 'go':
			ctx.clearRect(0, 0, 505, 51);
			ctx.fillText('Lives: ' + this.lives, 10, 10);
			break;
		default:
			break;
	}
	
	/*if (this.state === 'stop') {
		ctx.fillText('Press space to continue the game', 101, 238);
	} else if (this.state === 'start') {
		ctx.fillText('Press space to start and pause the game', 55, 238);
	} else if (this.state === 'won') {
		ctx.fillText('Won', 202, 238);
		this.lives = 5;
	} else if (this.state === 'lost') {
		ctx.fillText('Lost', 202, 238);
		this.lives = 5;
	} */
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
var allEnemies = [];
var i = 0;
do {
	// Make a new instance of Enemy
	var enemy = new Enemy;
	
	/* Calculate the basic speed by generating a 
	 * random number between 0 and 100.
	 */
	enemy.speed = 100 * Math.random();
	
	/* Choose which y position (row) the enemy is put in,
	 * with two enemies in the middle row. 
	 * And update the speed depending on which row the enemy is in:
	 * Fastest in the top row and slowest in the middle row.
	 */
	if (i < 1){
		enemy.y = 65;
		enemy.speed += 150;
	} else if (i < 2){
		enemy.y = 231;
		enemy.speed += 100;
	} else {
		enemy.y = 147;
		enemy.speed += 50;
	}
	
	// Add the new instance to the allEnemies array and up the counter.
	allEnemies.push(enemy);
	i++;
} while (i < 4);

var player = new Player;


// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'space',
		37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
