//----------------------------------Commentary--------------------------- word count: 500
//                     ---------discuss your finding--------
// The colour-converted images are 'noiser' than the filtered channel images. I could see 
// static-like effects at the CMYK colour-converted image while the colour channel images are 
// smooth gradients. This probably is an indicator to use the correct colour space, because the 
// YCbCr colour-converted image also has a static effect.

//                    ----------problems I faced----------
// I used to face the issue of my colour channels’ outputs being pure solid black images. 
// The reason was that I used to not create a separate copy of the webcam’s image before 
// processing it. Therefore, the base image kept getting modified continuously.

// Another problem was the moved origin point because it uses the WebGL canvas.  The WebGL 
// canvas alters the origin point of the canvas to the centre of the screen. Therefore, 
// when I switch back to the 2D canvas, it causes the images to be shifted accordingly. 
// Additionally, I can’t display text on a 2d canvas after creating a webgl canvas.

// To solve these issues, I’ve decided to make a conditional that will shift the canvas’s 
// origin to the top left corner of the screen if the user has visited the 1st extension 
// and defined a font (which is a requirement to display text for WEBGL)

//     ------did you complete your project? how would you address the issue---
// Yes, I have completed my project but not to my desired standard. My second extension 
// was to be a game where you move the character that is jumping between platforms with 
// your face.

// Initially, I tried to make this extension game with Matter.js, but it is unstable to 
// try to render bodies while ensuring the face detection works properly. The character 
// can randomly stick to other nearby bodies, despite the playable character’s position 
// being tied to the user’s face coordinate.

// As a result, I have no choice but to change it into a more simple game, a knock-off 
// flappy bird. This game uses your face’s y-coordinate to move your character vertically. 
// After this semester, I will experiment with Matter.js and possibly WEBGL, to identify 
// the issues and be capable of coding my desired projects in the future.

//                ----------discuss your extension------------
// For my extensions, I wanted to imitate filters you would see on TikTok. Mainly, the 
// filters built upon the popular ‘meme’ at the time, or one that is a game and requires 
// the user’s interaction. Therefore, in an attempt to make it a unique idea, I decided 
// to implement both, as if I was developing filters concept for TikTok.

// For my 1st extension, I decided to recreate the “I be popping bottle meme”, which 
// involves a video showing pictures of a gentleman posing transitioned to the beat of 
// the song “TIRED” by “CJ SO COOL”. But instead of the transition of images, I decided 
// to implement them on a cube instead. Additionally, it will have the user’s face 
// pasted over the gentleman’s face.

// For my 2nd extension, I decided to make a user-interactive webcam-based game where 
// you could move the in-game character with your body’s movement. Therefore, I decided 
// to code a Flappy Bird knock-off where the user could move the character by moving 
// their head.
//---------------------------------------------------------------------------------------
var capture;
let p;
const imgW = 160;
const imgH = 120;

const webImgW = imgW*2;
const webImgH = imgH*2;

let button;
let buttonToExtension;

var pictureTaken = false;
var resetThresh = false;
let font;

//to store the modes: default,extensionMenu,ex1,ex2
var mode;
////////////////////////////////////////////////////////
function preload(){
    //ex1
    imgblack = loadImage('assets/exten1/blackVest.jpeg');
    imggray = loadImage('assets/exten1/grayVest.jpeg');
    imgblue = loadImage('assets/exten1/blueVest.jpeg');
    blackSquare = loadImage('assets/exten1/blackSquare.png');
    heart = loadImage('assets/exten1/heart.png');
    TIRED = loadSound('assets/exten1/CJ_SO_COOL_TIRED.mp3');
    TIRED.setVolume(0.09); 

    imgblack.resize(300,300);
    imggray.resize(300,300);
    imgblue.resize(300,300);

    //ex2
    backgroundImgFlappy = loadImage('assets/exten2/flappyBackground.png');
    angelWings = loadImage('assets/exten2/angelWings.png');
        //Music by <a href="https://pixabay.com/users/white_records-32584949/?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=194370">Maksym Dudchyk</a> from <a href="https://pixabay.com/music//?utm_source=link-attribution&utm_medium=referral&utm_campaign=music&utm_content=194370">Pixabay</a>
    adventureSong = loadSound('assets/exten2/Adventure.mp3');
    adventureSong.setVolume(0.13);
        //by Team Pickle : https://www.youtube.com/@Sub2TeamPickle
    cottonEye = loadSound('assets/exten2/sadCottonEye.mp3');
    cottonEye.setVolume(0.13);

    //all
    mode = "default";
    font = loadFont('assets/inconsolata.otf');
}


function setup() {
    //to decide which setup to run depending on the mode.
    //by changing the mode, setup will be run again to load new setting
    if (mode != "ex1"){
        createCanvas(windowWidth,windowHeight);
    }
    textFont(font);

    if (mode == "default"){
        task1to13setup();
    }
    else if (mode == "extensionMenu"){
        extensionSetUpMaster();
    }
    else if (mode == "ex1"){
        iBePoppinsetup();
    }
    else if (mode == "ex2"){
        flappyFacesetup();
    }
}
////////////////////////////////////////////////////////////////////////////////
//this function will run when the user press the "snap" button
function masterTasks(){
    p = saveImage();
 
    //GrayscaleFD and Brightness + 20%
    GSnB = grayscaleFDNBright(p);

    //Red channel
    RedC = RGBChannel(p,255,0,0,0,true);

    //Green channel
    GreenC = RGBChannel(p,0,255,0,0,true);

    //Blue channel
    BlueC = RGBChannel(p,0,0,255,0,true);

    //Colour space 1
    CS1 = cmykChannel(p,255);


    //Colour space 2
    CS2 = YCbCrchannel(p,255);


    //Face detection, to return an image that only contain the detected face;
    FD = faceDetectionEdit(p);

    //to reset the webcam
    capture = createCapture(VIDEO);
    pictureTaken = true;
    resetThresh = true;
    capture.hide();
}
////////////////////////////////////////////////////////
function draw() {
    //similar to setup, to display necessary information depending on the mode
    background(40);

    if (mode == "default"){
        task1to13draw();
    }
    else if (mode == "extensionMenu"){
        extensionDrawMaster();
    }
    else if (mode == "ex1"){
        iBePoppindraw();
    }
    else if (mode == "ex2"){
        flappyFacedraw();
    }
}
///////////////////////////////////////////////////////////////
//to allow the user to change the face filter easily
function keyReleased(){
    if (keyCode == 37){
        console.log("FDchanged-gray");
        FDEffect = "gray";
    }
    if (keyCode == 38){
        console.log("FDchanged-blur");
        FDEffect = "blur";
    }
    if (keyCode == 39){
        console.log("FDchanged-CS1");
        FDEffect = "colour";
    }
    if (keyCode == 40){
        console.log("FDchanged-pixel");
        FDEffect = "pixel";
    }
}
////////////////////////////////////////////////////////////
//the project's tasks setup
function task1to13setup(){
    capture = createCapture(VIDEO);
    capture.hide();
    
    //to define the button to will save a snapshot of he webcam, and get the outputs of all filter
    button = createButton('snap');
    button.position(8,webImgH+10);
    button.size(80,20);
    button.mousePressed(masterTasks);
    button.show();

    //to define the button that will let the user to enter the extension menu
    buttonToExtension = createButton('enter extension menu');
    buttonToExtension.position(852,50);
    buttonToExtension.size(160,120);
    buttonToExtension.mousePressed(default_ExtenMaster);
    buttonToExtension.hide();

    
    RCsetup();
    prevRedCV = -1;
    
    GCsetup();
    prevGreenCV = -1;
    
    BCsetup();
    prevBlueCV = -1;
    
    CMYKsetup();
    prevCS1CV = -1;
    
    YCbCrsetup();
    prevCS2CV = -1;
    
    FDsetup();
    prevFDEffect = "none";
}
//////////////////////////////////////////////////////////////////////
function task1to13draw(){
    //by initialising webgl canvas, the origin is moved to the center of the screen.
    //this will help to reposition the game if the user has visited the 1st extension
    if (imagesForCube){
        translate(-windowWidth/2,-windowHeight/2);
    }

    //to display the webcam input
    image(capture, 0, 0,webImgW,webImgH,0,0,windowWidth,windowHeight);

    //to display texts, to guide the user
    fill(255);
    text("Red channel threshold value : "+RedChaSli.value(),RedChaSli.x+20, RedChaSli.y);
    text("Green channel threshold value : "+GreenChaSli.value(),GreenChaSli.x+20, GreenChaSli.y);
    text("Blue channel threshold value : "+BlueChaSli.value(),BlueChaSli.x+20, BlueChaSli.y);
    text("CS1 channel threshold value : "+CMYKChaSli.value(),CMYKChaSli.x+20, CMYKChaSli.y);
    text("CS2 channel threshold value : "+YCbCrChaSli.value(),YCbCrChaSli.x+20, YCbCrChaSli.y);

    text("Face Detection filter guide : ",windowWidth*3/4, windowHeight/4);
    text("Left Arrow : Gray scaleFD filter",windowWidth*3/4 + 100, windowHeight/4 + 20);
    text("Upward Arrow : Blur filter",windowWidth*3/4 + 100, windowHeight/4 + 40);
    text("Right Arrow : Color Space convert filter",windowWidth*3/4 + 100, windowHeight/4 + 60);
    text("Downward Arrow : Pixelated filter",windowWidth*3/4 + 100, windowHeight/4 + 80);

    //after 'snapping' a picture, all of the tasks' output will be displayed
    if (pictureTaken){
        //the webcam image
        image(p, 512,50,imgW,imgH,0,0,windowWidth,windowHeight);
        image(p, 512,440,imgW,imgH,0,0,windowWidth,windowHeight);
    
        //the grayscale and 20%+ brightness image
        image(GSnB, 682,50,imgW,imgH,0,0,windowWidth,windowHeight);
    
        //the red channel image
        image(RedC, 512,180,imgW,imgH,0,0,windowWidth,windowHeight);
    
        //the green channel image
        image(GreenC, 682,180,imgW,imgH,0,0,windowWidth,windowHeight);
    
        //the blue channel image
        image(BlueC, 852,180,imgW,imgH,0,0,windowWidth,windowHeight);
       
        //the red threshold image
        var currentRedCV = RedChaSli.value();
        if ((prevRedCV != currentRedCV)||resetThresh){
            RedCT = RGBChannel(RedC,255,0,0,currentRedCV,false);
            prevRedCV = currentRedCV;
        }

        image(RedCT, 512,310,imgW,imgH,0,0,windowWidth,windowHeight);

        //the green threshold image
        var currentGreenCV = GreenChaSli.value();
        if ((prevGreenCV != currentGreenCV)||resetThresh){
            GreenCT = RGBChannel(GreenC,0,255,0,currentGreenCV,false);
            prevGreenCV = currentGreenCV;
        }

        image(GreenCT, 682,310,imgW,imgH,0,0,windowWidth,windowHeight);
        
        //the blue threshold image
        var currentBlueCV = BlueChaSli.value();
        if ((prevBlueCV != currentBlueCV)||resetThresh){
            BlueCT = RGBChannel(BlueC,0,0,255,currentBlueCV,false);
            prevBlueCV = currentBlueCV;
        }
        image(BlueCT, 852,310,imgW,imgH,0,0,windowWidth,windowHeight);

        //the colour space 1 image
        image(CS1,682,440,imgW,imgH,0,0,windowWidth,windowHeight);

        //the colour space 2 image
        image(CS2,852,440,imgW,imgH,0,0,windowWidth,windowHeight);

        //the colour space 1 threshold image
        var currentCS1CV = CMYKChaSli.value();
        if ((prevCS1CV != currentCS1CV)||resetThresh){
            CS1CT = cmykChannel(p,currentCS1CV);
            prevCS1CV = currentCS1CV;
        }
        image(CS1CT,682,570,imgW,imgH,0,0,windowWidth,windowHeight);

        //the colour space 2 threshold image
        var currentCS2CV = YCbCrChaSli.value();
        if ((prevCS2CV != currentCS2CV)||resetThresh){
            CS2CT = YCbCrchannel(p,currentCS2CV);
            prevCS2CV = currentCS2CV;
        }
        image(CS2CT,852,570,imgW,imgH,0,0,windowWidth,windowHeight);
        image(p, 512,570,imgW,imgH,0,0,windowWidth,windowHeight);

        //the face filter.
        //will runs if a face is detected and saved
        if (FD){
            //since the face image is important to the extensions, the extensions will now be avaiable to the user 
            buttonToExtension.show();

            //every time the user change to a filter, it will be compared to the previous filter choice,
            //if its the same, it will stop processing the face image and only display the most recent filter applied.

            //therefore, if the user change to a different filter, this will be run again, 
            //to process the face image with a differnt filter
            if ((prevFDEffect != FDEffect) || resetThresh){
                if (FDEffect == "gray"){
                    processedFace = grayscaleFDNBright(FD);
                } else if (FDEffect == "blur"){
                    processedFace = blur(FD,floor(FD.width/4));
                } else if (FDEffect == "colour"){
                    processedFace = cmykChannel(FD,255);
                } else if (FDEffect == "pixel"){
                    var stepOne = grayscaleFDNBright(FD);
                    processedFace = pixelate(stepOne);
                }
                prevFDEffect = FDEffect;
            }

            //to displayed the filter-processed face over the webcam captured image at the right position
            push();
                translate(512,570);
                for (var i =0; i<faces.length;i++){
                    face=faces[i];
                    if (face[4]>4){
                        image(processedFace,face[0],face[1],face[2],face[3],0,0,windowWidth,windowHeight);
                    }
                }
            pop();
        }
        else{
            buttonToExtension.hide();
            FD = faceDetectionEdit(p);
        }

        //resetThresh's purpose is to update the source image to be filtered to all of the tasks.
        //by having resetThresh at the end, it will ensure that all image-filter functions get updated
        //after resetThresh get defined as false, no more update will be done to all of the image-filter functions. 
        //(until another webcam snapshot is done)
        resetThresh = false;
    }
}
////////////////////////////////////////////////////////////////////////