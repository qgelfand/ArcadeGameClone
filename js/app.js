var origPosX = 200; //x & y coordinates for the player's "home" position
var origPosY = 400;
var points = 0; // used to calculate victory (10 pts wins)
var lives = 3; //used to calculate defeat (0 lives loses)
var spawnTimer = 0; //used in Game.spawnEnemy
//var nullObjects = 0; //used in Game.nullEnemy

/* The Game class does many things:
 * Clears the Canvas at the start of the game loop
 * Draws the points & game title on the canvas
 * Spawns enemies
 * Controls gameState which is used to draw the Title, Victory and Defeat screens.
 */

var Game = function() {
        this.state = 'New Game';
    };
//check for win/lose condition
Game.prototype.update = function() {
    if (points >= 10) {
        this.state = 'Victory';
        points = 0;
        lives = 3;
    } else if (lives <= 0) {
        this.state = 'Defeat';
        points = 0;
        lives = 3;
    }
};
//if spacebar is pressed (via keyup event listener) then begin rendering game level (engine.js)
Game.prototype.handleInput = function(event) {
    this.state = 'Running';
};
//remove the current object from allEnemies and free up memory in the game engine. haven't gotten this to work
Game.prototype.nullEnemy = function(newEnemiesLength) {
    //"obj" in the line below needs to be the index of the object calling this method.
    // allEnemies.splice(obj,1);
};
//clears game screen. necessary when game state changes
Game.prototype.clearCanvas = function() {
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, 700, 700);
};
//draws New Game, Victory & Defeat screens
//also draws game title, score & lives on canvas while game is running
Game.prototype.renderText = function(gameState) {
    ctx.font = "20px Arial";
    if (gameState === 'New Game') {

        ctx.fillStyle = "#1F8FC1";
        ctx.fillRect(0, 50, 505, 535);
        ctx.font = "30px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("Pepperwood's Harrowing Adventure", 252.5, 150);
        ctx.font = "20px Arial";
        ctx.fillText("Points = 10 --> WIN", 252.5, 250);
        ctx.fillText("Lives = 0   --> LOSE", 252.5, 350);
        ctx.fillText("Press Space Bar to Play", 252.5, 550);
    } else if (gameState === 'Victory') {

        ctx.fillStyle = "green";
        ctx.fillRect(0, 50, 505, 535);
        ctx.font = "20px Arial";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText("YOU WON!", 252.5, 250);
        ctx.fillText("I bet you can't do it again.", 252.5, 350);
        ctx.fillText("Press Space Bar", 252.5, 450);
    } else if (gameState === 'Defeat') {

        ctx.fillStyle = "gray";
        ctx.fillRect(0, 50, 505, 535);
        ctx.fillStyle = "#1F8FC1";
        ctx.textAlign = "center";
        ctx.fillText("You are bad at this game... Try again?", 252.5, 250);
        ctx.fillText("Press Space Bar", 252.5, 450);
    } else if (gameState === 'Running') {
        ctx.font = "20px Arial";
        ctx.fillStyle = "#1F8FC1";
        ctx.textAlign = "center";
        ctx.fillText('Points: ' + points + ', Lives: ' + lives, 252.5, 40);
        ctx.fillText("Pepperwood's Harrowing Adventure", 252.5, 620);
    }
};
//spawns an enemy every 0.25 to 1.25 seconds at a random location and speed
Game.prototype.spawnEnemy = function(dt) {
    spawnTimer = spawnTimer - dt;
    if (spawnTimer <= 0) {
        var yPos = 60 + 85 * Math.floor((Math.random() * 3));
        var speed = Math.floor((Math.random() * 400) + 200);
        var enemySpawn = new Enemy(yPos, speed);
        spawnTimer = (Math.random() + 0.25);
        allEnemies.push(enemySpawn);
    }
};

/*Enemy objects are the bugs. They will make the player lose a life if they detect a collision
 */
var Enemy = function(yPos, speed) {
    this.sprite = 'images/enemy-bug.png';
    this.x = -120;
    this.y = yPos;
    this.speed = speed;
};

// Moves enemies across the screen based on their speed and stops moving them when they leave the screen.
// Then it checks for a collision with the player.
Enemy.prototype.update = function(dt) {
    if (this.x < 600) {
        this.x = this.x + this.speed * dt;
    } else {
        //the goal is to remove the current object from allEnemies and free up memory in the game engine. this will improve the game's stability
        //how do i find the index of the current object in allEnemies array?
        //game.nullEnemy(allEnemies.length);
    }
    this.checkCollision(player);
};
//draws enemy on canvas
Enemy.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//Collision detection code used from user "Udayan" on Udacity thread 
//https://discussions.udacity.com/t/trying-to-identify-collisions-but-how-do-i-compare-enemy-x-with-player-x/29930
Enemy.prototype.checkCollision = function(playr) {
    if (playr.x < this.x + 75 &&
        playr.x + 65 > this.x &&
        playr.y < this.y + 50 &&
        70 + playr.y > this.y) {
        playr.reset('no'); //player hit a bug, take a life away
    }
};

/*The Player object is what the user controls with the keyboard. 
 * When the player hits a bug or reaches the water, her position is reset and points are added or lives are lost.
 */
var Player = function() {
        this.sprite = 'images/char-boy.png';
        this.x = origPosX;
        this.y = origPosY;
    };
//I didn't need this method, but i kept it here for future use.
Player.prototype.update = function() {
    //player status updates
    //player movement?
};
//draws player on canvas
Player.prototype.render = function() {
    ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
};
//This method moves the player one tile based on the entered keystroke
//it also restricts the player to the game screen
Player.prototype.handleInput = function(entry) {
    if (entry && game.state === 'Running') {
        if (entry === 'up') { //it up arrow pressed, move player up 1 row
            if (this.y > 60) { // if player is not in the water or above
                this.y = this.y - 85;
            } else {
                player.reset('yes'); //the player reached the water, give a point
            }
        } else if (entry === 'down' && this.y < 400) {
            this.y = this.y + 85;
        } else if (entry === 'left' && this.x > 0) {
            this.x = this.x - 101;
        } else if (entry === 'right' && this.x < 400) {
            this.x = this.x + 101;
        }
    }
};
//resets player and gives a point or takes a life depending on what code called it.
Player.prototype.reset = function(point) {
    if (point === 'yes') {
        points++;
    } else if (point === 'no') {
        lives--;
    }
    game.update();
    player.x = origPosX;
    player.y = origPosY;
};

//instantiates the game & player 
var game = new Game();
var player = new Player();
var allEnemies = [];

// This listens for key presses and sends the keys to your Player.handleInput() method.
// I added 'space' to handle game state changes
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down',
        32: 'space'
    };
    if (allowedKeys[e.keyCode] === 'space') {
        game.handleInput(allowedKeys[e.keyCode]);
    } else {
        player.handleInput(allowedKeys[e.keyCode]);
    }
});