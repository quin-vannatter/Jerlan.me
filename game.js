var game = {};

/**
 * Anonymous function that runs the game script.
 */
(function() {

    // Game properties.
    var GAME_INTERVAL = 1 / 60;
    var ONE_SECOND = 1000;

    var DEFAULT = {
        player: {
            type: "player",
            texture: "images/player.png",
            id: {x:0, y:0},
            position: {x: 0, y: 0},
            velocity: {x: 0, y: 0},
            speed: 5,
            size: {x: 50, y:50},
            destroy: false,
            update: updatePlayer
        },
        wall: {
            type: "wall",
            texture: "images/wall.png",
            unitSize: {x: 50, y: 50},
            size: {x: 1, y: 1},
            position: {x: 0, y: 0},
            destroy: false
        },
        shot: {
            type: 'shot',
            texture: 'images/shot.png',
            size: {x: 13, y: 13}
        }
    }

    // Objects that update and draw.
    var objects = {
    };

    // Objects that can be created.

    /**
     * Creates an object.
     * 
     * @param {string} type The type of the object.
     * @param {object} data The data of the object.
     */
    function createObject(type, data) {

        // Create the default player.
        var object = copy(DEFAULT[type]);

        // Loop through and set assigned properties of the player.
        for(var prop in data) {
            if(data.hasOwnProperty(prop)) {
                object[prop] = data[prop];
            }
        }

        return object;
    }

    /**
     * Update function for a player.
     */
    function updatePlayer() {
        console.log(this.id);
    }

    /**
     * Update function for a shot.
     */
    function updateShot() {
        console.log(this);
    }

    /**
     * Copys an object and returns it.
     */
    function copy(object) {
        return Object.assign({},object);
    }

     /**
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

        // Loop through all the game objects.
        for(var prop in objects) {
            if(objects.hasOwnProperty(prop)) {
                var type = objects[prop];

                // Loop through each object for the current type.
                for(var i = type.length - 1; i >= 0; i--) {
                    var object = type[i];

                    // Remove if destroy is true.
                    if(object.destroy) {
                        type.splice(i,1);
                        continue;
                    }

                    // Update if there is an update function.
                    if(typeof object.update !== 'undefined') {
                        object.update();
                    }
                }
            }
        }

        // Recall the update function.
        setTimeout(function () {
             run(time);
        }, ONE_SECOND * GAME_INTERVAL);
    }

    // Adds an object to the game objects list.
    function add(object) {

        // Create if not created.
        if(typeof objects[object.type] === 'undefined') {
            objects[object.type] = [];
        }

        // Add the object.
        objects[object.type].push(object);
    }

    /**
     * Creates the map for the current game.
     */ 
    function createMap(map) {
        var walls = map[0];
        var spawns = map[1];

    }
    
    // Creating the public connections from server/client to game.
    game.run = run;
    game.createMap = createMap;
    game.createObject = createObject;
    game.vect = vect;
    game.add = add;

})();