//CMYK
let CMYKChaSli;

//setting up slider for this colour space
function CMYKsetup(){
    CMYKChaSli = createSlider(0,255,0);
    CMYKChaSli.position(8,webImgH+170);
    CMYKChaSli.show();
}
/////////////////////////////////////////////////////
var CS1;
var prevCS1CV;
var CS1CT;
/////////////////////////////////////////////////////
function cmykChannel(capture,threshhold){
    //to create a separate copy of the image
    var imageCMYK = capture.get();
    imageCMYK.loadPixels();
    
    //to iterate over all of the pixels
    for (var y = 0;y<imageCMYK.height;y++){
        for (var x = 0; x<imageCMYK.width;x++){
            var index = ((imageCMYK.width*y)+x)*4;

            //retrieve the colour values of a pixel
            var pRed = imageCMYK.pixels[index+0]/255;
            var pGreen = imageCMYK.pixels[index+1]/255;
            var pBlue = imageCMYK.pixels[index+2]/255;

            //to convert the RGB colour space to CMYK colour space values if the threshold condition is fulfilled
            var pCyan,pMagenta,pYellow,pBlack;
            if (((pRed+pGreen+pBlue)*64 < threshhold)){
                //RGB to CMY
                pCyan = 1-pRed;
                pMagenta = 1-pGreen;
                pYellow = 1-pBlue;

                //CMY to CMYK
                pBlack = min([pCyan,pMagenta,pYellow]);
                pCyan = (pCyan - pBlack)/(1-pBlack);
                pMagenta = (pMagenta - pBlack)/(1-pBlack);
                pYellow = (pYellow - pBlack)/(1-pBlack);

                //apply converted colour space value in the following of Cyan->Red, Magenta->Green, Yellow->Blue
                imageCMYK.pixels[index+0] = 255*pCyan;
                imageCMYK.pixels[index+1] = 255*pMagenta;
                imageCMYK.pixels[index+2] = 255*pYellow;
            }
            //if the condition is not fulfilled, no change to the current pixel
        }
    }
    imageCMYK.updatePixels();
    return imageCMYK;
}