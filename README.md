frontend-nanodegree-arcade-game
===============================

Requirements:
-------------
The Game uses the HTML5 Canvas element and all game functionality is implemented
with JavaScript.

I've used a 'Localhost' (WAMP Server) as my development environment.
The game should run without a web server, but within a modern browser
that supports HTML5 Canvas and JavaScript.

The game is not optimized for touch interfaces.


The Rules:
----------

- - -  ANY MODE  - - -
The player starts out with five lives. But every time the player hits one
of the enemy bugs a life is lost. And the player is returned to the starting position.

If the player looses all five lives the game is lost.

If the game is lost or won the player can start a new game.

The game can be paused and resumed at any time.


- - -  EASY MODE  - - -
The goal of the game is just to reach the water while evading 
the enemy bugs to win the game.

Once the player reaches the water the game ends.

- - -  ADVANCED MODE (Standard)  - - -
The goal of the game is to collect five stars and then get to the water
while evading the enemy bugs to win the game.

If the player hasn't collected at least 5 Stars, reaching the water does
not end the game.

The stars are collect by moving the player across the playing field, once
the player is in the same position as a star, the star is counted as collected
and disappears. Then a new star appears at another random location.

If an enemy collides with a star, this star also disappears and a new star appears.
// Comment: It's actually always the same star moved to a different location.

Once five stars are collected the player needs to reach the water at the
top of the playing field in order to win the game.


How it works:
-------------
1. Start the game:
	Once the game (index.html) is loaded the start screen appears.
	Pressing the SPACE BAR starts the game in advanced mode.
	Pressing the "1" starts the game in easy mode.

2. Pause the game:
	If the game is running, pressing the SPACE BAR pauses it.

3. Continue the game:
	If the game is paused, pressing the SPACE BAR resumes it.

4. Move the player:
	The player movement is controlled through the ARROW KEYS (up, down, left and right).
	By pressing one of the ARROW KEYS the player is moved one visible box in that direction.
	The player cannot move outside the visible canvas area.

5. Start a new game:
	Once the game is either lost or won, pressing the SPACE BAR restarts the game.
	Otherwise only reloading the page will start a new game.



Students should use this rubric: https://www.udacity.com/course/viewer#!/c-ud015/l-3072058665/m-3072588797
for self-checking their submission.
