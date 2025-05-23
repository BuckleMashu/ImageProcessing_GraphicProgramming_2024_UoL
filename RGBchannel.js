//setting up a slider for each colour of the RGB colour space
let RedChaSli;
let GreenChaSli;
let BlueChaSli;
function RCsetup(){
    RedChaSli = createSlider(0,255,0);
    RedChaSli.position(8,webImgH+50);
    RedChaSli.show();
}

function GCsetup(){
    GreenChaSli = createSlider(0,255,0);
    GreenChaSli.position(8,webImgH+90);
    GreenChaSli.show();
}

function BCsetup(){
    BlueChaSli = createSlider(0,255,0);
    BlueChaSli.position(8,webImgH+130);
    BlueChaSli.show();
}
//////////////////////////////////////////////////////////////////
var RedC;
var prevRedCV;
var RedCT;

var GreenC;
var prevGreenCV;
var GreenCT;

var BlueC;
var prevBlueCV;
var BlueCT;
////////////////////////////////////////////////////////////////
//There used to be three separate functions for each colour.
//so i refactor the code by combining them together into one function

//another benefit of making them into 1 function is that i could, if i wanted to, have three sliders working one a single function. 
//this allows me to dynamically isolate three colours independantly with a singular function 
//rather than isolating one colour per function.
//this can be done with connecting the 3 sliders to the 2nd,3rd, and 4th input (each representing a colour channel)
function RGBChannel(capture,threshR,threshG,threshB,threshM,bool){
    //to create a separate copy of the input image
    var imageMaster = capture.get();
    imageMaster.loadPixels();
    
    //to iterate over all of the pixels
    for (var y = 0;y<imageMaster.height;y++){
        for (var x = 0; x<imageMaster.width;x++){
            var index = ((imageMaster.width*y)+x)*4;

            var pRed = imageMaster.pixels[index+0];
            var pGreen = imageMaster.pixels[index+1];
            var pBlue = imageMaster.pixels[index+2];

            //the var bool will decide if the output image rely on the threshold value
            // if true, it will just simply isolate a colour from the colour space
            if (bool){
                if (pRed <= threshR){
                    imageMaster.pixels[index+1] = 0;
                    imageMaster.pixels[index+2] = 0;
                }
    
                if (pGreen <= threshG){
                    imageMaster.pixels[index+0] = 0;
                    imageMaster.pixels[index+2] = 0;
                }
    
                if (pBlue <= threshB){
                    imageMaster.pixels[index+0] = 0;
                    imageMaster.pixels[index+1] = 0;
                }
            }else{
                //if the bool variable is false and the input image already have its color channel isolated, I can make pixels turn blacks 
                //if their colour values is lesser than the threshold (threshM)

                //this will allow me to select which colour threshold im modifying
                var temp2;
                var temp = [threshR,threshG,threshB]; //to contain all of the threshold value
                var temp3 = [pRed,pGreen,pBlue];

                //how this works it works is that it iterate over each thresh value (that correspond to each colour)
                //with the context of if i want to isolate eg red, the input will be (capture,255,0,0,tresh value,false)
                //thus, this for-loop will find which colour is being isolated by checking if its 2nd, 3rd or 4th input equal to 255.
                //after being found, temp2 will be used to store the respective colour value to be compared to threshM.
                for (var i =0; i<temp.length;i++){
                    if (temp[i] == 255){
                        temp2 = temp3[i];
                        break;
                    }
                }
                if ((temp2 <= threshM)){
                    imageMaster.pixels[index+0] = 0;
                    imageMaster.pixels[index+1] = 0;
                    imageMaster.pixels[index+2] = 0;
                }
            }
        }
    }
    imageMaster.updatePixels();
    return imageMaster;
}