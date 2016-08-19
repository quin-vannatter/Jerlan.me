var connection;

/**
 * Anonymous function that runs the game script.
 */
(function() {

    // Game properties.
    var GAME_INTERVAL = 1 / 60;
    var ONE_SECOND = 1000;

    // Player properties.
    var PLAYER_TYPE = "player";
    var PLAYER_TEXTURE = "images/player.png";
    var PLAYER_MAX_SPEED = 5;
    var PLAYER_SIZE = {
        x: 50,
        y: 50
    };
    
    // Wall properties.
    var WALL_TYPE = "wall";
    var WALL_TEXTURE = "images/wall.png";
    var WALL_UNIT_SIZE = {
        x: 50,
        y: 50
    };

    // Objects that update and draw.
    var objects = [];
    
    // When the page is loaded, this is triggered.
    document.addEventListener('DOMContentLoaded', function() {
        var p = player(vect(0,0),0);
        objects.push(p);

        var w = wall(vect(0,0),vect(1,2));
        objects.push(w);

        run();
    });

    // Objects that can be created.

    /**
     * player
     * Creates a player which can be controlled.
     * 
     * @param {object} position The position of the player.
     * @param {int} id The ID of the player.
     * returns a new player object.
     */
    function player(position, id) {

        // Player texture.
        var texture = new Image();
        texture.src = PLAYER_TEXTURE;

        // The update function of the player.
        var update = function(object) {
            move(object);
        }
        
        // Create the player and return it.
        var player = {
            type: PLAYER_TYPE,
            id: id,
            position: position,
            size: PLAYER_SIZE,
            maxSpeed: PLAYER_MAX_SPEED,
            velocitiy: {
                x: 0,
                y: 0
            },
            update: function() {
                update(player)
            }
        };

        return player;
    }

     /**
     * wall
     * Creates a wall which interacts with other game objects.
     * 
     * @param {object} position The position of the wall.
     * @param {object} size The size of the wall. Expected in units of walls.
     * returns a new wall object.
     */
    function wall(position, size) {

        // Wall texture.
        var texture = new Image();
        texture.src = WALL_TEXTURE;

        // Wall size
        var wallSize = {
            x: size.x * WALL_UNIT_SIZE.x,
            y: size.y * WALL_UNIT_SIZE.y
        };
        
        // Create the player and return it.
        return {
            type: WALL_TYPE,
            position: position,
            size: wallSize
        }
    }

    /**
     * vect
     * Creates a vector with an x and y.
     * @param {int} x The x value of the vector.
     * @param {int} y The y value of the vector.
     * returns a vector.
     */
    function vect(x,y) {
        return {
            x: x,
            y: y
        };
    }

    // Functions that game objects can use.

    /**
     * move
     * Given that the passed in object has a velocitiy and position,
     * this function will move the player by its velocitiy.
     * @param {object} object The object being moved.
     */
    function move(object) {
        object.position.x += object.velocitiy.x;
        object.position.y += object.velocitiy.y;
    }

    // Functions that run the game.

    /**
     * Loops through the objects and calls the update function.
     */
    function run(lastTime) {

        // Get the current time.
        var time = new Date();

        console.log(time - lastTime);

        // Loop through all the game objects.
        for(var i = 0; i < objects.length; i++) {
            var object = objects[i];
        }

        // Recall the update function.
        setTimeout(function () {
             run(time);
        }, ONE_SECOND * GAME_INTERVAL);
    }

    /**
     * initalize
     * Initalization for the game. Creates everything.
     */ 
    function initalize() {

    }
    
})();