var game = {};

/**
 * Anonymous function that runs the game script.
 */
(function() {

    // Game properties.
    var GAME_INTERVAL = 1000 / 60;

    var DEFAULT = {
        default: {
            position: {x: 0, y: 0},
            velocity: {x: 0, y: 0},
            size: {x: 0, y: 0},
            enabled: true,
            drawable: true,
            visible: true,
            collidable: true,
            destroy: false
        },
        player: {
            type: 'player',
            texture: 'images/player.png',
            id: -1,
            speed: 5,
            size: {x: 50, y:50},
            update: updatePlayer
        },
        wall: {
            type: 'wall',
            texture: 'images/wall.png',
            unitSize: {x: 50, y: 50},
            size: {x: 1, y: 1},
        },
        shot: {
            type: 'shot',
            texture: 'images/shot.png',
            size: {x: 13, y: 13},
            update: updateShot
        },
        camera: {
            type: 'camera',
            zoom: {x: 1, y: 1},
            focus: null,
            drawable: false,
            ease: 5,
            center: {x: 0, y: 0},
            initalize: updateSize,
            updateSize: updateSize,
            update: updateCamera
        }
    }

    // Objects that update and draw.
    var objects = {};

    // Objects that can be created.

    /**
     * Creates an object.
     * 
     * @param {string} type The type of the object.
     * @param {object} data The data of the object.
     */
    function createObject(type, data) {

        // Create the default object.
        var object = copy(DEFAULT.default);

        // Add default properties for that type.
        for(var prop in DEFAULT[type]) {
            if(DEFAULT[type].hasOwnProperty(prop)) {

                // Add value if not object, copy if it is.
                if(typeof DEFAULT[type][prop] !== 'object') {
                    object[prop] = DEFAULT[type][prop];
                } else {
                    object[prop] = copy(DEFAULT[type][prop]);
                }
            }
        }

        // Loop through and set assigned properties of the player.
        for(var prop in data) {
            if(data.hasOwnProperty(prop)) {
                object[prop] = data[prop];
            }
        }

        // Run object initalization code if there is any.
        if(typeof object.initalize !== 'undefined') {
            object.initalize();
        }

        // Set the texture as an image, if there is a texture.
        if(typeof object.texture !== 'undefined') {
            var image = new Image();
            image.src = object.texture;
            object.texture = image;
        }

        return object;
    }

    /**
     * Update function for a player.
     * @param {int} deltaTime The amount of time since last update.
     */
    function updatePlayer(deltaTime) {
        move(this, deltaTime);
    }

    /**
     * Update function for a shot.
     * @param {int} deltaTime The amount of time since last update.
     */
    function updateShot(deltaTime) {
        move(this, deltaTime);
    }

    /**
     * Update function for a camera.
     * @param {int} deltaTime The amount of time since last update.
     */
    function updateCamera(deltaTime) {

        // If there is a focus object, move the camera towards it.
        if(this.focus != null) {
            this.velocity = {x: 0, y: 0};
            
            this.position.x += ((this.focus.position.x + this.center.x) - this.position.x) / 
                this.ease * deltaTime / GAME_INTERVAL;

            this.position.y += ((this.focus.position.y + this.center.y) - this.position.y) / 
                this.ease * deltaTime / GAME_INTERVAL;
        }

        // Move the camera by the velocitiy.
        move(this, deltaTime);
    }

    /**
     * Update function for a camera frame.
     */
    function updateSize() {

        // If there is a focus object, update the center value.
        if(this.focus != null) {
            this.center = {
                x: this.focus.size.x/2 - this.size.x/2,
                y: this.focus.size.y/2 - this.size.y/2
            }
        }
    }

    /**
     * Copys an object and returns it.
     * @param {object} object The object being copied.
     * @return The copy of the object.
     */
    function copy(object) {

        // Object that will be returned.
        var result = {};

        // Loop through and add each property to the object.
        for(var prop in object) {
            if(object.hasOwnProperty(prop)) {

                // If the value isn't an object.
                if(typeof object[prop] !== 'object') {
                    result[prop] = object[prop];
                } else {
                    result[prop] = copy(object[prop]);
                }
            }
        }

        // Return the result.
        return result;
    }

     /**
     * Creates a wall which interacts with other game objects.
     * 
     * @param {object} position The position of the wall.
     * @param {object} size The size of the wall. Expected in units of walls.
     * @return a new wall object.
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

    // Functions that game objects can use.

    /**
     * Given that the passed in object has a velocitiy and position,
     * this function will move the player by its velocitiy.
     * @param {object} object The object being moved.
     * @param {int} deltaTime The amount of time since last update.
     */
    function move(object, deltaTime) {
        object.position.x += (object.velocity.x * deltaTime / GAME_INTERVAL);
        object.position.y += (object.velocity.y * deltaTime / GAME_INTERVAL);
    }

    /**
     * Calculates the distance between two points.
     * @param {object} posA Position A value.
     * @param {object} posB Position B value.
     */
    function getDistance(posA, posB) {
        return Math.sqrt(Math.pow(posB.x - posA.x, 2) + Math.pow(posB.y - posA.y, 2));
    }

    // Functions that run the game.

    /**
     * Loops through the objects and calls the update function.
     * @param {int} deltaTime The amount of time since last update.
     */
    function update(deltaTime) {

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
                        object.update(deltaTime);
                    }
                }
            }
        }
    }

    /**
     * Adds an object to the game objects list.
     * @param {object} object The object being added.
     */ 
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

    /**
     * Gets all objects that can be drawn.
     * @return All the game objects that can be drawn.
     */
    function getDrawables() {

        var drawables = [];

         // Loop through all the game objects.
        for(var prop in objects) {
            if(objects.hasOwnProperty(prop)) {
                var type = objects[prop];

                // Loop through each object for the current type.
                for(var i = type.length - 1; i >= 0; i--) {
                    var object = type[i];

                    // Add to drawables if drawable.
                    if(object.drawable) {
                        drawables.push(object);
                    }
                }
            }
        }

        return drawables;
    }
    
    // Creating the public connections from server/client to game.
    game.GAME_INTERVAL = GAME_INTERVAL;
    game.getDrawables = getDrawables;
    game.update = update;
    game.createMap = createMap;
    game.createObject = createObject;
    game.add = add;
})();