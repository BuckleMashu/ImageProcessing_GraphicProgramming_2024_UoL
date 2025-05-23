var GSnB;
function grayscaleFDNBright(capture){
    //create another copy of the input image
    var imageGSnB = capture.get();
    imageGSnB.loadPixels();
    
    //to iterate over all pixels
    for (var y = 0;y<imageGSnB.height;y++){
        for (var x = 0; x<imageGSnB.width;x++){
            var index = ((imageGSnB.width*y)+x)*4;
            var pRed = imageGSnB.pixels[index+0];
            var pGreen = imageGSnB.pixels[index+1];
            var pBlue = imageGSnB.pixels[index+2];

            var average = (pRed + pGreen + pBlue)/3

            //to increase the brightness of the pixel by 20%
            average = average*1.20;
            if(average>255){ //cap the brightness increase
                average = 255;
            }

            //by applying the same value for RGB, the image will only have the tone of black<-->white
            imageGSnB.pixels[index+0] = average;
            imageGSnB.pixels[index+1] = average;
            imageGSnB.pixels[index+2] = average;
        }
    }
    //saves the changes
    imageGSnB.updatePixels();
    return imageGSnB;

}