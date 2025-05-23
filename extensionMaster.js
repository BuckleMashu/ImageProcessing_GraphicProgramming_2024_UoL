//the purpose of this file is to load a menu, to allow the users to select any of the available extensions 
//or switch back to the project's tasks
let buttonExten1;
let buttonExten2;
let buttonBackToDefault;

function extensionSetUpMaster(){
    //define the extension 1's button
    buttonExten1 = createButton('Extension 1');
    buttonExten1.size(160,120);
    buttonExten1.mousePressed(exMenu_extension1);
    buttonExten1.show();

    //define the extension 2's button
    buttonExten2 = createButton('Extension 2');
    buttonExten2.size(160,120);
    buttonExten2.mousePressed(exMenu_extension2);
    buttonExten2.show();

    //positioning of the buttons
    //if there are more buttons, this will allow them to be placed automatically
    var allExButton = [buttonExten1,buttonExten2];
    var itemNo = allExButton.length/2;
    var firstButtonPos = 165*itemNo;
    for (var i =0;i<allExButton.length;i++){
        allExButton[i].position((windowWidth/2) -firstButtonPos,windowHeight/2);
        firstButtonPos-=165;
    }

    //define the button to let the user to move back to the project's tasks
    buttonBackToDefault = createButton('Back to the main tasks');
    buttonBackToDefault.position(10,10);
    buttonBackToDefault.size(160,120);
    buttonBackToDefault.mousePressed(default_ExtenMaster);
    buttonBackToDefault.show();
}

function extensionDrawMaster(){

}
/////////////////////////////////////////////////////
//to hide and display appropriate interactions when switching between the extension menu and the project's task
function default_ExtenMaster(){
    if (mode == "default"){
        mode = "extensionMenu";
        noCanvas();
        button.hide();
        YCbCrChaSli.hide();
        CMYKChaSli.hide();
        RedChaSli.hide();
        GreenChaSli.hide();
        BlueChaSli.hide();
        buttonToExtension.hide();

        setup();
    } else if (mode == "extensionMenu"){
        mode = "default";
        noCanvas();
        buttonExten1.hide();
        buttonExten2.hide();
        buttonBackToDefault.hide();
        setup();
    }
}
//////////////////////////////////////////////////////////////