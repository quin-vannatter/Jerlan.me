(function() {
    document.addEventListener("DOMContentLoaded",function() {
        var player = game.createObject("player",{
            id: 65
        });
        game.add(player);
        game.run();
    });
})();