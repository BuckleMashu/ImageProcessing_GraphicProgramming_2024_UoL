//image
//background image is from https://toppng.com/show_download/88987/flappy-bird-atlas
let backgroundImgFlappy;
//image is from https://pngtree.com/freepng/hand-drawn-style-angel-wings_4383921.html
let angelWings;

//visual
var backgroundCountFlappy;
var allPillars;
var flappy;
var retryFlappyButton;

let cottonEye;
let adventureSong;

//game mechanic
var detectorEX2;
var faceCoord;
var flappyHeightChange;
var prevcenterFD;
var centerYforFD;
var middlescreen;

//ui
var score;
var startFlappyButton;
var isUserPlaying;
var isUserAlive;

function flappyFacesetup(){
    angleMode(DEGREES);

    detectorEX2 = new objectdetect.detector(80,60,scaleFDmine,classifier);
    middlescreen = windowWidth/2;

    //to remove the previous interation of the buttons when the user retry the game
    if (startFlappyButton && retryFlappyButton && buttonBackToExMenuFromEx2){
        startFlappyButton.remove();
        retryFlappyButton.remove();
        buttonBackToExMenuFromEx2.remove();
    }

    //to initialise a button to allow user to start playing the game
    startFlappyButton = createButton('START');
    startFlappyButton.position(windowWidth/7,windowHeight/2);
    startFlappyButton.size(160,120);
    startFlappyButton.mousePressed(changePlayState);
    startFlappyButton.show();

    //to initialise a button to allow the user to retry the game
    retryFlappyButton = createButton('RETRY?');
    retryFlappyButton.position(windowWidth/7,windowHeight/2);
    retryFlappyButton.size(160,120);
    retryFlappyButton.mousePressed(flappyFacesetup);
    retryFlappyButton.hide();

    //to inititialise a button to let the user move back to the extension menu
    buttonBackToExMenuFromEx2 = createButton('Back to the Extension menu');
    buttonBackToExMenuFromEx2.position(10,10);
    buttonBackToExMenuFromEx2.size(160,120);
    buttonBackToExMenuFromEx2.mousePressed(exMenu_extension2);
    buttonBackToExMenuFromEx2.show();

    isUserPlaying = false;

    //to add sufficient amount of background.
    backgroundCountFlappy = [];
    for (var i = 0; i<5;i++){
        var backgroundmeh = new flappyBackgroundGenerate(windowWidth/4 + (backgroundImgFlappy.width * i));
        backgroundCountFlappy.push(backgroundmeh);
    }

    //to stop any song from playing, if any
    //mainly for when the user retry the game
    adventureSong.stop();
    cottonEye.stop();

    //ensure there are no pillars before the user start playing the game
    allPillars = [];
    isUserAlive = true;
    
    //a variable that help playing an important role in remembering the previous position of the user
    prevcenterFD = -1;

    //to define the initial position of the user
    flappy = {x:middlescreen,y:windowHeight/2};

    //define the initial score
    score = 0;
}

function flappyFacedraw(){
    //by initialising webgl canvas, the origin is moved to the center of the screen.
    //this will help to reposition the game if the user has visited the 1st extension
    if (imagesForCube){
        translate(-windowWidth/2,-windowHeight/2);
    }

    //to manage the background, allowing the background to move slowly to the left
    //and removing the one thats already out of the view in order to add more background form the right.
    //creating an illusion that the player is always flying to the right
    if (backgroundCountFlappy.length < 5 && frameCount%45==0){
        toGenerateBackground();
    }
    for(var i = 0;i<backgroundCountFlappy.length;i++){
        backgroundCountFlappy[i].render();

        if (isUserAlive){
            backgroundCountFlappy[i].move();
        }

        if (backgroundCountFlappy[i].x < ((windowWidth/4) - backgroundImgFlappy.width - 5)){
            backgroundCountFlappy.splice(i,1);
        }
    }

    //to draw the green ground
    drawGroundEX2();
    
    //after the user press play, it will start procedurally generate obstacles in the format of pillars,
    //that will move slowly to the right
    if (isUserPlaying){
        if (allPillars.length < 5 && frameCount%150==0){
            toGeneratePillars();
        }
        for(var i = 0;i<allPillars.length;i++){
            allPillars[i].renderPillar();
            //if the user collide against a pillar, the user will lose the game
            if ((flappy.x + 30 > allPillars[i].x && flappy.x - 30 < allPillars[i].x + 230) && 
                (flappy.y - 30 <allPillars[i].sy || flappy.y + 30 > allPillars[i].Ry)){
                isUserAlive = false;
            }

            //as long as the user is playing, the pillar will continuously move to the left.
            //creating an illusion that the player is moving.
            if (isUserAlive){
                allPillars[i].move();
            }

            //to remove pillars that is out of the user's view and add 1 to the score when it happens
            if (allPillars[i].x < ((windowWidth/6) - 220)){
                allPillars.splice(i,1);
                score++;
            }
        }
        //start playing the audio when the user is playing the game
        if (adventureSong.isPlaying() == false){
            adventureSong.play();
        }
    }
    else{
        //to display the game's title before the user plays it
        push();
            textSize(100);
            text("Flappy Face",windowWidth/3,windowHeight/3);
        pop();
    }

    //to limit the playing field by drawing two gray bar at the each side of the screen
    push();
    fill(40);
    rect(0,0,windowWidth/4,windowHeight);
    rect(windowWidth*3/4,0,windowWidth/4,windowHeight);
    pop();

    //to show the webcam output at the bottom left corner of the screen
    image(capture, 0, windowHeight-60,80,60,0,0,windowWidth,windowHeight);
    //to draw a red dot at the nose of the user and return the relative position of the user's face relative to the screen size
    faceCoord = faceDetectionSquare(capture);
    
    //if new face coord is detected, the face's y-coord will be mapped to the web browser's height.
    //essentially, allowing the user to move the flappy face by moving their heads up or down
    if (faceCoord){
        centerYforFD = faceCoord[1] + faceCoord[3]/2;
        if ((Math.abs(centerYforFD - prevcenterFD) <= 0.5) || prevcenterFD == -1){
            flappyHeightChange = map(centerYforFD,0,60,20,windowHeight-20);
        }
        prevcenterFD = centerYforFD;
    }

    if (isUserAlive){
        //if the user is still playing the game, the height change of the flappy face will be applied
        if (faceCoord){
            flappy.y = flappyHeightChange;
        }
    }else{
        //if not, the flappy face will fall down and a "GAME OVER" text will be displayed
        whenUserDies();

        //stopping the upbeat audio and start playing the sad audio.
        if (adventureSong.isPlaying()){
            adventureSong.stop();
        }
        if (cottonEye.isPlaying()==false){
            cottonEye.play();
        }
    }

    //to draw the flappy face, which have a conditional that will rotate flappy face if the user crashed into pillar
    drawFlappy();

    //to display the score of the user
    drawScoreFlappy();
}

function faceDetectionSquare(capture){
    var imageFD = capture.get();
    var facesEX2 = detectorEX2.detect(imageFD.canvas);
    var faceEX2;
        for (var i =0; i<facesEX2.length;i++){
            faceEX2=facesEX2[i];
            if (faceEX2[4]>4){
                push();
                    fill(255,0,0);
                    ellipse(faceEX2[0]+faceEX2[2]/2,windowHeight - 60 + faceEX2[1] + (faceEX2[3]/2),3);
                pop();
            }
        }
    if (faceEX2){
        return faceEX2;
    }
}
////////////////////////////////////////////////////////////////////
function toGenerateBackground(){
    var backgroundmeh = new flappyBackgroundGenerate(windowWidth*3/4);
    backgroundCountFlappy.push(backgroundmeh);
}

function drawGroundEX2(){
    push();
    noStroke();
    fill(0,200,0);
    rect(windowWidth/4,windowHeight-60,windowWidth/2,windowHeight);
    pop();
}

function toGeneratePillars(){
    var randomGap = floor(random(80,windowHeight-230));
    var pillBlock = new pillar(windowWidth*3/4,randomGap,randomGap+185);
    allPillars.push(pillBlock);
}

function whenUserDies(){
    if (flappy.y < windowHeight+100){
        flappy.y = flappy.y + (flappy.y) * 0.018;
        flappy.x = flappy.x - 0.1;
    }

    push();
            textSize(100);
            fill(255,0,0);

            if (flappy.y > windowHeight*3/4){
                text("GAME",windowWidth/3 - 80,windowHeight/3);
            }
            if ( flappy.y > windowHeight){
                text("OVER",windowWidth/2 + 80,windowHeight/3)
            }

            retryFlappyButton.show();
    pop();
}

function drawFlappy(){
    push();
        translate(flappy.x - 45,flappy.y - 45);
        if (isUserAlive == false){
            rotate(flappy.y);
        }
        image(angelWings,-70,-77,200,200);
        image(FD,0,0,70,70);
    pop();
}

function drawScoreFlappy(){
    push();
        textSize(50);
        text("SCORE : "+score,windowWidth*3/4 + 40,windowHeight/4);
    pop();
}
//////////////////////////////////////////////////////////////////////
//the constructor that help to create, draw, and move the pillars
class pillar{
    constructor(startingX,gapSy,gapFy){
        this.x = startingX + 105;
        this.sy = gapSy;
        this.fy = gapFy + (windowHeight - gapFy)/2;
        this.Ry = gapFy;
        this.Hy = gapSy/2;
    }

    renderPillar(){
        push();
            fill(100,255,100);
            stroke(0,0,0);
            strokeWeight(3);


            rect(this.x+20,0,170,this.sy);
            rect(this.x,this.sy - 30,210,30);

            rect(this.x+20,this.Ry,170,windowHeight-60);
            rect(this.x,this.Ry,210,30);
        pop();
    }

    move(){
        this.x = this.x - 3;
    }
}

//the constructor that helps with defining the position of the background, draw  the background, and move it
class flappyBackgroundGenerate{
   constructor(x){
    this.x = x;
   } 
   render(){
    image(backgroundImgFlappy,this.x,0,backgroundImgFlappy.width,windowHeight);
   }

   move(){
    this.x = this.x - 0.5;
   }
}
///////////////////////////////////////////////////////////////////
//to hide the play button when the user press it.
function changePlayState(){
    if (isUserPlaying == false){
        isUserPlaying = true;
        startFlappyButton.hide();
    }
}
///////////////////////////////////////////////////////////////////
//to hide,remove,and show appropraite change to move between the extension menu and this extension
function exMenu_extension2(){
    if (mode == "extensionMenu"){
        mode = "ex2";
        noCanvas();
        buttonExten1.hide();
        buttonExten2.hide();
        buttonBackToDefault.hide();
        setup();

    } else if (mode == "ex2"){
        mode = "extensionMenu";
        noCanvas();
        buttonBackToExMenuFromEx2.remove();
        startFlappyButton.hide();
        retryFlappyButton.hide();
        adventureSong.stop();
        cottonEye.stop();
        setup();
    }
}