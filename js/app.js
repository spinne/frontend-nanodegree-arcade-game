/* Game logic for a version of the "frogger" game.
 * Sylvia Schmidt - 28.07.2015
 */

// Enemies our player must avoid
var Enemy = function() {
    // Variables applied to each of our instances.

	/* Draw all enemies to the left of the canvas (x-position).
	 * Define the y-position variable and the speed variable.
	 */
	this.x = -101;
	this.y = 0;
	this.speed = 0;

    // The image/sprite for our enemies, this uses
    // a helper we've provided to easily load images
    this.sprite = 'images/enemy-bug.png';
};


// Update the enemy's position, required method for game
// Parameter: dt, a time delta between ticks
Enemy.prototype.update = function(dt) {
    // You should multiply any movement by the dt parameter
    // which will ensure the game runs at the same speed for
    // all computers.

	// Check player.state if the game is running, if not stop moving the enemies.
	if (player.state === 'go') {
		// Move the enemies along the screen with the set speed and time delta.
		this.x += this.speed * dt;
	}

	// If an enemy moves off the screen on the right, reset it to the left.
	if (this.x > 505){
		this.x = -101;
	}
};


// Draw the enemy on the screen, required method for game.
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};


// Calculate various y-positions and speeds for an enemy. 
Enemy.prototype.velosity = function() {
	/* Calculate the basic speed by generating a
	 * random number between 0 and 100.
	 */
	this.speed = 100 * Math.random();

	/* Choose which y position (row) the enemy is put in,
	 * with two enemies in the middle row.
	 * And update the speed depending on which row the enemy is in:
	 * Fastest in the top row and slowest in the middle row.
	 * This if/else statement uses the global variable i.
	 */
	if (i < 1){
		this.y = 65;
		this.speed += 150;
	} else if (i < 2){
		this.y = 231;
		this.speed += 100;
	} else {
		this.y = 147;
		this.speed += 50;
	}
}

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.
var Player = function() {
	// Starting point for the player.
	this.x = 202;
	this.y = 404;

	// Variables for game state, player lives, score (collected stars), and easy mode.
	this.state = 'start';
	this.lives = 5;
	this.score = 0;
	this.easy = false;

	// Image for the player, using the provided helper.
	this.sprite = 'images/char-boy.png';
};


// update() method for the player
Player.prototype.update = function() {
	/* Collision detection using circles.
	 * The basic algorithm is described here: https://developer.mozilla.org/en-US/docs/Games/Techniques/2D_collision_detection
	 * To check collision against all enemies, the detection is within a for-loop.
	 * Used for collision with enemies and collecting stars.
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
		var collitionX = enemiesCenterX - playerCenterX;
		var collitionY = enemiesCenterY - playerCenterY;
		var distance = Math.sqrt(collitionX * collitionX + collitionY * collitionY);

		/* The actual collision detection: If the distance between the centres
		 * is smaller then the sum of the defined radii, there is a collision.
		 */
		if (distance < (playerRadius + enemiesRadius)) {
			// Reset the player to the starting position.
			this.x = 202;
			this.y = 404;
			// Subtract one life.
			this.lives -= 1;
			// Update the screen.
			this.gameStates();
		}

		/* Collision detection for the collectable items with both enemies and player
		 * The calculations for the circle centre of collectable star.
		 * Using a radius of 40.
		 */
		var starCenterX = star.x + 50;
		var starCenterY = star.y + 108;
		var starRadius = 40;

		// Collision Star and Enemy
		var starCollitionX = enemiesCenterX - starCenterX;
		var starCollitionY = enemiesCenterY - starCenterY;
		var starDistance = Math.sqrt(starCollitionX * starCollitionX + starCollitionY * starCollitionY);

		// If an enemy hits the star, move the star to new position.
		if (starDistance < (starRadius + enemiesRadius)){
			star.position();
		}

		// Collision Star and Player (Collection)
		var starCollectionX = playerCenterX - starCenterX;
		var starCollectionY = playerCenterY - starCenterY;
		var starCollectDistance = Math.sqrt(starCollectionX * starCollectionX + starCollectionY * starCollectionY);

		// If Player collects star, up the score and update the screen, then move the star.
		if (starCollectDistance < (starRadius + playerRadius)){
			this.score += 1;
			this.gameStates();
			star.position();
		}
	}

	// Checking if the player has reached the water, collected 5 stars and won.
	if (this.y < 0 && this.score > 4) {
		this.state = 'won';
	}

	// Checking if the player has lost all his lives.
	if (this.lives < 1) {
		this.x = 202;
		this.y = 404;
		this.state = 'lost';
	}
};


// render() method - to draw the player on the screen.
// Also handles state changes and calls the star.render() method.
Player.prototype.render = function() {
	star.render();
	ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	if (this.state != 'go'){
		this.gameStates();
	}
};


// handleInput() method - to move the player.
Player.prototype.handleInput = function(key) {
	// Check player.state to start, play, pause or reload game. Select mode.
	if (key === 'space' || key === '1' || key === '2') {
		if (this.state === 'go') {
			this.state = 'stop';
		} else if (this.state === 'won' || this.state === 'lost') {
			// Change the speed of the bugs for the new game
			var leng = allEnemies.length;
			for (var k = 0; k < leng ; k++) {
				/* The global variable i is set equal to k to make sure 
				 * the enemy bugs are distributed correctly.
				 * Then call the velosity function and set the x-package off the canvas.
				*/
				i = k;
				allEnemies[k].velosity();
				allEnemies[k].x = -101;
			}
			// Reset the necessary variables for a new game.
			this.state = 'start';
			this.x = 202;
			this.y = 404;
			this.lives = 5;
			this.score = 0;
			this.easy = false;
			this.gameStates();
		} else if (key === '1'){
			// If easy mode is chosen, set the easy variable to true
			// and the score to 5, to allow the player to win just by reaching the water.
			this.easy = true;
			this.score = 5;
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
				}
				break;
			case 'up':
				if (this.y > 0) {
					this.y -= 83;
				}
				break;
			case 'right':
				if (this.x < 404) {
					this.x += 101;
				}
				break;
			case 'down':
				if (this.y < 404) {
					this.y += 83;
				}
				break;
			default:
				break;
		}
	}
};


/* gameStates method
 * This method only draws the texts depending on the player.state variable.
 * The actual start / stop / play / pause functionality is implemented with
 * changes to the player.state variable throughout this code.
 */
Player.prototype.gameStates = function(){
	// Set basic font style.
	ctx.font = '18px sans-serif';
	ctx.textBaseline = 'top';

	if (this.state != 'go') {
		// Draw semi-translucent rectangle to make text more readable.
		ctx.fillStyle = 'rgba(255,255,255,0.85)';
		ctx.fillRect(0, 185, 505, 195);
		ctx.fillStyle = '#333';

		// Check state and draw appropriate text.
		switch (this.state) {
			case 'stop':
				ctx.fillText('Press SPACE to continue.', 101, 280);
				ctx.font = 'bold 22px sans-serif';
				ctx.fillText('Paused!', 215, 198);
				break;
			case 'won':
				ctx.fillText('Want to try again? Hit SPACE.', 101, 280);
				ctx.font = 'bold 22px sans-serif';
				ctx.fillText('Gratulations You Won!', 145, 198);
				break;
			case 'lost':
				ctx.fillText('Want to try again? Hit SPACE.', 101, 280);
				ctx.font = 'bold 22px sans-serif';
				ctx.fillText('Sorry, you lost.', 185, 198);
				break;
			case 'start':
				ctx.fillText('Press SPACE to start the game, help the boy collect', 51, 228);
				ctx.fillText('5 stars and then cross to the water to win.', 101, 250);
				ctx.fillText('Too difficult? Press "1" to start EASY MODE and', 51, 280);
				ctx.fillText('just help the boy cross to the water.', 101, 302);
				ctx.fillText('Press SPACE to pause or continue.', 101, 332);
				ctx.fillText('Use ARROW KEYS to move the boy.', 101, 354);
				ctx.font = 'bold 22px sans-serif';
				ctx.fillText('Help the Boy!', 185, 198);
				break;
			default:
				break;
		}
	}

	// Draw number of lives and number of collected stars on canvas.
	if (this.state === 'go' || this.state === 'start') {
		ctx.clearRect(0, 0, 505, 51);
		// Only show the score hint in advanced mode
		if (this.score > 4 && this.easy === false) {
			ctx.fillText('Enough Stars! Get to the Water!', 125, 12);
		}
		ctx.font = '22px sans-serif';
		ctx.fillStyle = '#333';
		ctx.fillText('Lives: ' + this.lives, 10, 10);
		// Only show the score advanced mode
		if (this.easy === false) {
			ctx.fillText('Stars: ' + this.score, 400, 10);
		}
	}
};


// Class for collectable Star.
var Star = function(){
	this.x = 0;
	this.y = 0;
	// Image for the Star, using the provided helper.
	this.sprite = 'images/Star.png';
};

// position() method - to create a random position for the star.
Star.prototype.position = function() {
	// Creating random numbers.
	var randomX = 5 * Math.random();
	var randomY = 3 * Math.random();

	/* Assign x and y a value, depending on the random numbers.
	 * So stars only appear on the "road" rows.
	 */
	if (randomX < 1) {
		this.x = 0;
	} else if (randomX < 2) {
		this.x = 101;
	} else if (randomX < 3) {
		this.x = 202;
	} else if (randomX < 4) {
		this.x = 303;
	} else if (randomX < 5) {
		this.x = 404;
	}

	if (randomY < 1) {
		this.y = 72;
	} else if (randomY < 2) {
		this.y = 155;
	} else if (randomY < 3) {
		this.y = 238;
	}
};

// Draws the star on the canvas
Star.prototype.render = function() {
	if (player.easy === false) {
		ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
	}
};

// The Array for the enemies.
var allEnemies = [];

// Populate the allEnemies array.
var i = 0;
do {
	// Make a new instance of Enemy.
	var enemy = new Enemy();
	
	// Call the enemy.velosity function to calculate its y-position and speed.
	enemy.velosity();
	
	// Add the new instance to the allEnemies array and up the counter.
	allEnemies.push(enemy);
	i++;
} while (i < 4);

// Create the player.
var player = new Player();

// Create the collectable star.
var star = new Star();

// Run the position method once to create a random position.
star.position();

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
// Added 'space' (32) and '1' (49) for game controls.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        32: 'space',
		37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
		49: '1'
    };
    player.handleInput(allowedKeys[e.keyCode]);
});
