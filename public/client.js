(function() {

    // Used in the drawing of the game.
    var canvas;
    var context;

    // The background image of the game.
    var imageBG;

    // Objects specific to this client.
    var player;
    var camera;

    var game;

    // When the client loads, start initalization and game.
    document.addEventListener("DOMContentLoaded",function() {
        
        // Create a connection to the game object.
        game = gameStarter.start();

        // Get the canvas.
        canvas = document.getElementById('canvas');
        context = canvas.getContext("2d");

        // Create the background image.
        imageBG = new Image();
        imageBG.src = 'images/bg.png';

        // Resize the canvas.
        resizeCanvas();

        // Start the game.
        initalize();
    });

    /**
     * Creates everything and starts the game loop.
     */
    function initalize() {
        player = game.createObject("player");
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
        draw();
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

        // Call the client's update function.
        update(time - oldTime);

        // Loop the game loop.
        setTimeout(function () {
            gameLoop(time);
        },game.GAME_INTERVAL);
    }

    var a = false;

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
            if(object.visible) {

                // Calculate canvas position based on camera.
                var x = object.position.x - camera.position.x;
                var y = object.position.y - camera.position.y;

                // Draw the image.
                context.drawImage(object.texture, x, y, object.size.x, object.size.y);
                applyColor(object, x, y);
            }
        }
    }

    /**
     * Applys the color property to the object.
     * @param {object} object The drawable object that will have the color applied.
     * @param {int} x The x location of the image being changed.
     * @param {int} y The y location of the image being changed.
     */
    function applyColor(object, x, y) {
        var color = object.color;

        // Color being applied must be applied to an image with grey scale to work properly.

        // Create a percentage from -100% to 100% to act as the increase to the current value of a pixel.
        var percentage = {
            r: (color.r / 256 * 2) - 1,
            g: (color.g / 256 * 2) - 1,
            b: (color.b / 256 * 2) - 1
        }

        // Get the image data of the image that was just drawn.
        var imageData = context.getImageData(x, y, object.size.x, object.size.y);
        var length = object.size.x * object.size.y * 4;

        // Loop through each pixel.
        for(var i = 0; i < length; i += 4) {

            /* Apply the color to each pixel. The percentage is the lowest value working from either end of the pixel value.
             * Eg. A value of 250 will have a 100% value of 5 because a value of 250 is too high of a change.
             * So, in a case where red is 255, it will have an increase of 5 on a value of 5 or 250, where as a red value of 0 will
             * have a change of -5 on 5 or 250.
             */
            imageData.data[i] = Math.min(imageData.data[i],256 - imageData.data[i]) * percentage.r + imageData.data[i];
            imageData.data[i + 1] = Math.min(imageData.data[i + 1],256-imageData.data[i + 1]) * percentage.g + imageData.data[i + 1];
            imageData.data[i + 2] = Math.min(imageData.data[i + 2],256-imageData.data[i + 2]) * percentage.b + imageData.data[i + 2];

            // If any pixel values go past 0 or 255, apply the difference to the other two pixel values.
            // Eg. a red pixel of 265 would become 255 while blue and green would increase by 10.
            if(imageData[i] > 255) {
                var diff = imageData[i] - 256;
                imageData.data[i + 1] += diff;
                imageData.data[i + 2] += diff;
                imageData[i] = 0;
            } else if(imageData[i] < 0) {
                imageData.data[i + 1] += imageData[i];
                imageData.data[i + 2] += imageData[i];
                imageData[i] = 0;
            }

            if(imageData[i + 1] > 255) {
                var diff = imageData[i + 1] - 256;
                imageData.data[i] += diff;
                imageData.data[i + 2] += diff;
                imageData[i] = 0;
            } else if(imageData[i + 1] < 0) {
                imageData.data[i] += imageData[i + 1];
                imageData.data[i + 2] += imageData[i + 1];
                imageData[i + 1] = 0;
            }

            if(imageData[i + 2] > 255) {
                var diff = imageData[i + 2] - 256;
                imageData.data[i] += diff;
                imageData.data[i + 1] += diff;
                imageData[i + 2] = 0;
            } else if(imageData[i + 2] < 0) {
                imageData.data[i] += imageData[i + 2];
                imageData.data[i + 1] += imageData[i + 2];
                imageData[i + 2] = 0;
            }
        }

        // Apply the changes to the context.
        context.putImageData(imageData, x, y);
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