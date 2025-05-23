function pixelate(capture){
    //to create a separate copy of the input image
    var imagePixel = capture.get();
    var outImagePixel = createImage(imagePixel.width,imagePixel.height);
    outImagePixel.loadPixels();
    
    //to determine the range of pixels to group together and have the same colour values
    //so that mean that every pixels within a 5 pixel diameter of a center pixel will have the same colour value
    var yside = 5, xside = 5;

    //to find how many iteration needed to be done, since we need to split the image intou 5x5 pixel block
    var iterationY = floor(imagePixel.height/5);
    var iterationX = floor(imagePixel.width/5);

    //iterate over all pixels
    for (var y = 0;y<iterationY;y++){
        for (var x = 0; x<iterationX;x++){
            var redSum= 0;
            var greenSum = 0;
            var blueSum = 0;
            var count = 0;

            //allow me to get the range of pixels to share the same avg pixel intensity
            //so eg sx = 0, fx = 5, sy = 0, and fy = 5. therefore
            //all pixels within the coord (0,0), (5,0), (5,5), and (5,0) will have the same colour value
            var sx = x * xside;
            var fx = sx + xside;
            var sy = y * yside;
            var fy = sy + yside;
            for (var i = sx; i < fx;i++){
                for (var j = sy; j<fy;j++){
                    //since we are only using get() instead of index to retrieve a pixel's colour value,
                    //we dont need to follow the learning material method
                    let c = imagePixel.get(i,j);
                    redSum+=c[0];
                    greenSum+=c[1];
                    blueSum+=c[2];
                    count++;
                }
            }

            //to find the avg colour value of the pixels within range
            let apply = [redSum/count,greenSum/count,blueSum/count,255];

            //to apply the avg colour values to all of the pixels within the defined range
            for (var i = sx; i < fx;i++){
                for (var j = sy; j<fy;j++){
                    outImagePixel.set(i,j,apply);
                }
            }
        }
    }
    //save the outimagepixel and return it
    outImagePixel.updatePixels();
    return outImagePixel;

}