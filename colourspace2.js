//ITUYCbCr, specifically the 10.4 ITU.BT-601 Y'CbCr from the Colour Space Conversions document
let YCbCrChaSli;
var tempArr;

//setting up the colour value of this colourspace
function YCbCrsetup(){
    YCbCrChaSli = createSlider(0,255,0);
    YCbCrChaSli.position(8,webImgH+210);
    YCbCrChaSli.show();
}
/////////////////////////////////////////////////////////
var CS2;
var prevCS2CV;
var CS2CT;
////////////////////////////////////////////////////////
function YCbCrchannel(capture,threshhold){
    //to create a separate image of the input
    var imageYCbCr = capture.get();
    imageYCbCr.loadPixels();
    
    //to iterate over all of the pixels
    for (var y = 0;y<imageYCbCr.height;y++){
        for (var x = 0; x<imageYCbCr.width;x++){
            var index = ((imageYCbCr.width*y)+x)*4;

            //get the current pixel's colour values
            var pRed = imageYCbCr.pixels[index+0];
            var pGreen = imageYCbCr.pixels[index+1];
            var pBlue = imageYCbCr.pixels[index+2];

            //if the condition is fulfilled depending on the threshold, RGB will be converted to YCbCr
            if (((pRed+pGreen+pBlue)/3 < threshhold)){
                var pY,pCb,pCr;
                tempArr = [pY,pCb,pCr];

                //made it into a matrix to reduce the amount of coding (refactoring)
                var matrix = [[0.299,0.587,0.114],
                              [-0.169,-0.331,0.500],
                              [0.500,-0.419,-0.081]];
                for (var i = 0; i<tempArr.length;i++){
                    tempArr[i] = (matrix[i][0]*pRed) + (matrix[i][1]*pGreen) + (matrix[i][2]*pBlue);
                };
                
                //to apply Y -> Red, Cb -> Green, Cr -> Blue
                imageYCbCr.pixels[index+0] = tempArr[0]+16;
                imageYCbCr.pixels[index+1] = tempArr[1]+128;
                imageYCbCr.pixels[index+2] = tempArr[2]+128;
            }
            //if the condition is not fulfilled, the current pixel will not change
        }
    }
    imageYCbCr.updatePixels();
    return imageYCbCr;
}