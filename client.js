(function() {

    var canvas;
    var context;
    var backgroundImg;

    var player;
    var camera;

    // When the client loads, start initalization and game.
    document.addEventListener("DOMContentLoaded",function() {

        // Get the canvas.
        canvas = document.getElementById('canvas');
        context = canvas.getContext("2d");

        // Create the background image.
        backgroundImg = new Image();
        backgroundImg.src = 'images/bg.png';

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
        console.log(player.position);
        camera = game.createObject("camera",{
            focus: player,
            size: {
                x: canvas.width,
                y: canvas.height
            }
        });
        console.log(player.position);

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
        var backgroundPattern = context.createPattern(backgroundImg, 'repeat');
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

                if(!a)console.log([camera]);a = true;

                // Draw the image.
                context.drawImage(object.texture, x, y, object.size.x, object.size.y);
            }
        }
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