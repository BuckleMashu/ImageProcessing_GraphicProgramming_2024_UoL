//base variables to store the images
let imgblack;
let imggray;
let imgblue;
let blackSquare;
let forTexture;
let heart; //https://clipart-library.com/clip-art/heart-border-transparent-6.htm

//base variable to store the audio file
let TIRED; //Song name: TIRED,  by: CJ SO COOL

//variables to allow the mechanic to work
var imagesForCube;
var imgRotation;
var alphaVariation;
var backgroundVariation;
var tintOpacity;

var tempo;
var speed;
var size;

//face detection for the imgblack,imggray, and imgblue
var detectorEX1; 
var facesEX1;
var faceEX1;

//UI
let buttonBackToExMenuFromEx1;
let exCanvas;

function iBePoppinsetup(){
    //to create a WEBGL canvas for the 3d cube
    exCanvas =createCanvas(windowWidth, windowHeight, WEBGL);
    angleMode(DEGREES);

    //to create a button to exit the extension
    buttonBackToExMenuFromEx1 = createButton('Back to the Extension menu');
    buttonBackToExMenuFromEx1.position(10,10);
    buttonBackToExMenuFromEx1.size(160,120);
    buttonBackToExMenuFromEx1.mousePressed(exMenu_extension1);
    buttonBackToExMenuFromEx1.show();

    detectorEX1 = new objectdetect.detector(300,300,scaleFDmine,classifier);
    //explanation below
    imagesForCube = [findFace(FD,imgblack),findFace(FD,imggray),findFace(FD,imgblue)];
    imgRotation = 0;

    //to create a canvas that will be applied onto the cube
    forTexture = createGraphics(300,300);

    //initialising value for the edit mechanic variables
    alphaVariation = 150;
    backgroundVariation = 40;
    tempo = false;
    size = 300;
}

function iBePoppindraw(){
    //this will allow the background to change from black to gray depends on the tempo
    background(backgroundVariation);

    //ensure the song plays
    if (TIRED.isPlaying() == false){
        TIRED.play();
    }

    //set that the base square will have its X-axis side red, Y-axis side green, and Z-axis side blue
    normalMaterial();

    //to make appropirate changes that match the bpm of the audio,
    //in this case, the darkening/undarkening of the background, the alpha of the black square covering the texture of the cube,
    //, and to switch the image on the cube
    changesPerBeat();

    //allow the texture(which is the three image of a guy posing) to switch to another based on the bpm 
    forTexture.image(imagesForCube[imgRotation],0,0);

    //isolated to allow to fluctuate the opacity of the black image which overlaying the texture/picture of a guy posing. 
    push();
        forTexture.tint(255,alphaVariation);
        forTexture.image(blackSquare,0,0);
    pop();

    //apply the canvas onto the cube, which consist of a black img overlaying a picture of a guy posing
    texture(forTexture);

    //similar to changesPerBeat(), it uses the tempo varable to change opacity of other components,
    //and aplpy them accordingly while rotating the cube.
    rotatingCube();
    
    //allow of the heart border png to show up and hide itself depend on the tempo
    push();
        tint(255, tintOpacity);
        image(heart,(-windowWidth/2) - size/2,-windowHeight/2 - size/2 ,windowWidth + size ,windowHeight + size);
    pop();
}

//essentially, a face detection function.
//but at the end, it will apply the the user's face from the project onto where the face was detected.
function findFace(FD,img){
    var tempImg = img.get();
    tempImg.resize(300,300);
    facesEX1 = detectorEX1.detect(tempImg.canvas);
    for (var i =0; i<facesEX1.length;i++){
        faceEX1=facesEX1[i];
        if (faceEX1[4]>4){
            return addFace(FD,tempImg,faceEX1);
        }
    }
}

function addFace(FD,img,pos){
    var tempFD = FD.get();
    var tempImg = img.get();
    tempFD.resize(pos[2],pos[3]);
    tempImg.set(pos[0],pos[1],tempFD);
    return tempImg;
}


function changesPerBeat(){
    if (frameCount%81 == 0){
        if (tempo){
            tempo = false;
            if (imgRotation == imagesForCube.length-1){
                imgRotation = 0; 
            }else{
                imgRotation++;
            }
            alphaVariation = 0; 
            backgroundVariation = 120;
        }else{
            tempo = true;
        }
    }
    else{
        backgroundVariation--;
    }
}

function rotatingCube(){
    if (tempo){
        speed = frameCount*2;
        size-=2;
        alphaVariation+=3;
        tintOpacity-=4;
    }else{
        speed = frameCount/10;
        size+=2;
        tintOpacity = 150;
    }

    push();
        rotateX(speed);
        rotateY(speed);
        rotateZ(speed);
        box(size);
    pop();
}
///////////////////////////////////////////////////////////////////
//to hide,stop, and display necessary buttons/visuals when switching between the extension menu and the extension.
function exMenu_extension1(){
    if (mode == "extensionMenu"){
        mode = "ex1";
        noCanvas();
        buttonExten1.hide();
        buttonExten2.hide();
        buttonBackToDefault.hide();
        TIRED.play();
        setup();
    } else if (mode == "ex1"){
        mode = "extensionMenu";
        noCanvas();
        exCanvas.remove();
        buttonBackToExMenuFromEx1.remove();
        TIRED.stop();
        setup();
    }
}