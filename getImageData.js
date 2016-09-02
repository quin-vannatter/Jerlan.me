// This script will pull data from an image and create an array that can be inserted.

var canvas;
var context;

document.addEventListener('DOMContentLoaded', function() {
    canvas = document.createElement('canvas');
    context = canvas.getContext('2d');

    createImage('images/' + prompt('Enter image source.'));
});

function loadImage(){
    context.drawImage(this,0,0,this.naturalWidth,this.naturalHeight);
    var imageData = context.getImageData(0,0,this.naturalWidth,this.naturalHeight);
    var output = [];
    for(var i = 0; i < imageData.data.length; i += 4) {
        var found = false;
        var d1 = [imageData.data[i],imageData.data[i + 1],imageData.data[i + 2],imageData.data[i + 3]]
        for(var h = 0; h < output.length; h++) {
            var d2 = output[h];
            if(d1[0] == d2[0] && d1[1] == d2[1] && d1[2] == d2[2] && d1[3] == d2[3]) {
                found = true;
                d2[4].push(i);
            }
        }
        if(!found) {
            output.push([d1[0],d1[1],d1[2],d1[3],[i]]);
        }
    }
    var main = [0,-1];
    for(var i = 0; i < output.length; i++) {
        if(main[1] == -1 || Math.max(main[0],output[1][4].length) != main[0]) {
            main = [output[1][4].length, i];
        }
    }
    var base = output[main[1]];
    base.splice(4,1);
    output.splice(main[1],1);
    output = [base,this.naturalWidth,this.naturalHeight,output];
    console.log(JSON.stringify(output));
}

function createImage(source) {
    var image = new Image();
    image.src = source;
    image.onload = loadImage;
}