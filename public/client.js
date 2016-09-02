/**
 * Anonymous function that runs the client script.
 */
(function() {

    // Used in the drawing of the game.
    var canvas;
    var context;

    // The background image of the game.
    var imageBG;

    // Objects specific to this client.
    var player;
    var camera;

    // This is how the client interacts with the game.
    var game;

    // Key map for the controls.
    var inputMapping = {
        up: ['KeyW','Arrow Up'],
        down: ['KeyS', 'Arrow Down'],
        left: ['KeyA', 'Arrow Left'],
        right: ['KeyD', 'Arrow Right'],
        shoot: [1],
        teleport: [3]
    };

    // The cursor position.
    var cursor = {
        x: 0,
        y: 0
    };

    // Used to check if a certian key is pressed or not. 
    var input = {};
    var inputOld = {};

    // When the client loads, start initalization and game.
    document.addEventListener("DOMContentLoaded",function() {

        // Set up the events for the controls.
        document.addEventListener('keydown',checkControl);
        document.addEventListener('keyup',checkControl);
        document.addEventListener('mousedown',checkControl);
        document.addEventListener('mouseup',checkControl);
	    window.addEventListener('resize', resizeCanvas);

        // Create a connection to the game object.
        game = startGame.start();

        // Get the canvas.
        canvas = document.getElementById('canvas');
        context = canvas.getContext("2d");

        // Create the background image.
        imageBG = new Image();
        imageBG.src = 'images/bg.png';

        // Resize the canvas.
        resizeCanvas();

		// Add the states to the input states.
		for(var key in inputMapping){
			if(inputMapping.hasOwnProperty(key)) {
                input[key] = [];
                inputOld[key] = [];
                for(var i = 0; i < inputMapping[key].length; i++) {
				    input[key][i] = false;
				    inputOld[key][i] = false;
                }
			}
		}

        // Start the game.
        initalize();
    });

    /**
     * Event triggered when controls are interacted with.
     * 
     * @param {object} e The event arguments for the input event.
     */
    function checkControl(e) {

        // Loop through the keys of the input mapping.
        for(var key in inputMapping) {
			if(inputMapping.hasOwnProperty(key)) {

                // Loop through the keys of the current mapping and apply the change.
                for(var i = 0; i < inputMapping[key].length; i++) {
                    switch(e.type) {
                        case 'keydown':
                        case 'keyup':
                                if(e.code === inputMapping[key][i]) {
                                    input[key][i] = e.type === 'keydown';
                                }
                            break;
                        case 'mousedown':
                        case 'mouseup':
                            if(e.which === inputMapping[key][i]) {
                                input[key][i] = e.type === 'mousedown';
                            }

                            // Used to calculate the cursor position.
                            var r = canvas.getBoundingClientRect();
                            var c = camera.position;

                            // Update the cursor.
                            cursor = {
                                x: e.clientX - r.left + c.x,
                                y: e.clientY - r.top + c.y
                            };
                            break;
                    }
                }
			}
		}
    }

    /**
     * Small function that checks all values in an array and returns true if one is true.
     * 
     * @param {array} keys The keys being checked.
     * @return True if atleast one of the keys is true.
     */
    function c(keys) {

        // Check if atleast one.
        var result = false;

        // Loop through and check each key.
        for(var i = 0; i < keys.length; i++) {
            result = result || keys[i];
        }

        // Return the result.
        return result;
    }

    /**
     * Gets the changes for the current input.
     * 
     * @return A list of controls that changed and whether they changed or not.
     */
    function getChanges() {

        // Holds the keys that changed in the controls.
        var mapping = {};
		var changed = false;

        // Loop through the keys and check if there were any changes.
		for(var key in this.inputMapping) {
			if(this.inputMapping.hasOwnProperty(key)) { 
				if(this.inputOld[key] != this.input[key]) {
					mapping[key] = this.input[key];
					changed = true;
				}
			}
		}
		return {
			mapping: mapping,
			changed: changed
		};
    }

    /**
     * Updates old controls to the new controls, should be done at the end of the update.
     */
    function updateOldMapping() {

        // Loop through controls and update old controls.
        for(var key in this.input) {
            if(this.input.hasOwnProperty(key)) {
                this.inputOld[key] = this.input[key];
            }
        } 
    }

    /**
     * Creates everything and starts the game loop.
     */
    function initalize() {
        game.add(game.createObject("wall",{
            position: {
                x: 30,
                y: 100
            }
        }));
        game.add(game.createObject("wall",{
            position: {
                x: 0,
                y: 300
            }
        }));
        game.add(game.createObject("wall",{
            position: {
                x: 320,
                y: 200
            }
        }));
        player = game.createObject("player");
        game.add(game.createObject("shot",{
            color: player.color
        }));
        camera = game.createObject("camera",{
            focus: player,
            size: {
                x: canvas.width,
                y: canvas.height
            }
        });

        game.add(player);
        game.add(camera);
        gameLoop();
    }

    /**
     * Updates the game, input and draws.
     * @param {int} deltaTime The time difference between the last frame and the current frame.
     */
    function update(deltaTime) {
        game.update(deltaTime);
        player.color.r++;
        if(player.color.r>255) player.color.r = 0;
        draw();
    }

    /**
     * Checks the controls for changes, applies changes.
     */
    function checkControls() {
        if(c(input.up)) {
            player.velocity.y = -player.speed;
        } else if (c(input.down)) {
            player.velocity.y = player.speed;
        } else {
            player.velocity.y = 0;
        }

        if(c(input.left)) {
            player.velocity.x = -player.speed;
        } else if (c(input.right)) {
            player.velocity.x = player.speed;
        } else {
            player.velocity.x = 0;
        }
    }

    /**
     * Process of calculating time between frames and looping the game.
     * @param {int} oldTime The time at the last frame of the game.
     */
    function gameLoop(oldTime) {
        
        // First frame assumes delta time is game interval.
        if(typeof oldTime === 'undefined') {
            oldTime = new Date() - game.GAME_INTERVAL;
        }

        // Get the current time.
        time = new Date();

        // Check the controls for the client.
        checkControls();

        // Call the client's update function.
        update(time - oldTime);

        // Update the old control mapping.
        updateOldMapping();

        // Loop the game loop.
        setTimeout(function () {
            gameLoop(time);
        },game.GAME_INTERVAL);
    }

    /**
     * Draws all game objects in the game.
     */
    function draw() {

        // Clear the canvas.
        context.clearRect(0, 0, canvas.width, canvas.height);
        
        // Create the background.
        var backgroundPattern = context.createPattern(imageBG, 'repeat');

        context.fillStyle = backgroundPattern;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // Loop through the drawable game objects.
        var objects = game.getDrawables();
        for(var i = 0; i < objects.length; i++) {
            var object = objects[i];

            // If the object is visible;
            if(object.visible && object.ready) {

                // Calculate canvas position based on camera.
                var x = object.position.x - camera.position.x;
                var y = object.position.y - camera.position.y;

                if(!colorsMatch(object.colorOld,object.color)) {
                    applyColor(object);
                }
                
                context.drawImage(object.drawTexture, x, y, object.size.x, object.size.y);
            }
        }
    }

    /**
     * Checks if colors match.
     * 
     * @return True if the two colors match.
     */
    function colorsMatch(colorA, colorB) {
        return colorA.r == colorB.r && colorA.b == colorB.b && colorA.g == colorB.g;
    }

    /**
     * Applys the color property to the object.
     * @param {object} object The drawable object that will have the color applied.
     * @param {int} x The x location of the image being changed.
     * @param {int} y The y location of the image being changed.
     * @param {object} context The context in which to draw the image.
     */
    function applyColor(object) {

        // Canvas that will be drawn on.
        var canvas = document.createElement('canvas');
        var context = canvas.getContext('2d');
        canvas.width = object.size.x;
        canvas.height = object.size.y;
        var color = object.color;

        // Start with an image on the canvas.
        context.drawImage(object.texture,0,0,object.size.x,object.size.y);

        // Create a percentage from -100% to 100% to act as the increase to the current value of a pixel.
        var percentage = {
            r: (color.r / 256 * 2) - 1,
            g: (color.g / 256 * 2) - 1,
            b: (color.b / 256 * 2) - 1
        }

        // Get the image data of the image that was just drawn.
        var imageData = context.getImageData(0, 0, object.size.x, object.size.y);
        var length = object.size.x * object.size.y * 4;

        // If the data is not undefined.
        if(typeof imageData.data !== 'undefined') {

            // Loop through each pixel.
            for(var i = 0; i < length; i += 4) {

                /* Apply the color to each pixel. The percentage is the lowest value working from either end of the pixel value.
                * Eg. A value of 250 will have a 100% value of 5 because a value of 250 is too high of a change.
                * So, in a case where red is 255, it will have an increase of 5 on a value of 5 or 250, where as a red value of 0 will
                * have a change of -5 on 5 or 250.
                */
                imageData.data[i] = Math.min(imageData.data[i],256 - imageData.data[i]) * percentage.r + imageData.data[i];
                imageData.data[i + 1] = Math.min(imageData.data[i + 1], 256-imageData.data[i + 1]) * percentage.g + imageData.data[i + 1];
                imageData.data[i + 2] = Math.min(imageData.data[i + 2], 256-imageData.data[i + 2]) * percentage.b + imageData.data[i + 2];
                
                // If any pixel values go past 0 or 255, apply the difference to the other two pixel values.
                // Eg. a red pixel of 265 would become 255 while blue and green would increase by 10.
                if(imageData.data[i] > 255) {
                    var diff = imageData.data[i] - 256;
                    imageData.data[i + 1] += diff;
                    imageData.data[i + 2] += diff;
                    imageData.data[i] = 0;
                } else if(imageData.data[i] < 0) {
                    imageData.data[i + 1] += imageData.data[i];
                    imageData.data[i + 2] += imageData.data[i];
                    imageData.data[i] = 0;
                }

                if(imageData.data[i + 1] > 255) {
                    var diff = imageData.data[i + 1] - 256;
                    imageData.data[i] += diff;
                    imageData.data[i + 2] += diff;
                    imageData.data[i] = 0;
                } else if(imageData.data[i + 1] < 0) {
                    imageData.data[i] += imageData.data[i + 1];
                    imageData.data[i + 2] += imageData.data[i + 1];
                    imageData.data[i + 1] = 0;
                }

                if(imageData.data[i + 2] > 255) {
                    var diff = imageData.data[i + 2] - 256;
                    imageData.data[i] += diff;
                    imageData.data[i + 1] += diff;
                    imageData.data[i + 2] = 0;
                } else if(imageData.data[i + 2] < 0) {
                    imageData.data[i] += imageData.data[i + 2];
                    imageData.data[i + 1] += imageData.data[i + 2];
                    imageData.data[i + 2] = 0;
                }
            }
        }

        // Redraw the image.
        context.putImageData(imageData,0,0);

        // Set the color and texture of the object.
        object.drawTexture.src = canvas.toDataURL('image/png');
        object.colorOld = game.copy(object.color);
    }

    /**
     * Resizes the canvas to fit the window.
     * Also updates the camera to match the change.
     */
    function resizeCanvas() {

        // Set the canvas width and height.
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;

        // Update the camera if it is set.
        if(typeof camera !== 'undefined') {

            // Set the camera size.
            camera.size = {
                x: canvas.width,
                y: canvas.height
            };

            // Update the center location of the camera.
            camera.updateSize();
        }
    }
})();