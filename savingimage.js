// this will form images a tthe following coord (windowWidth--> 1536/3=512)
//1: 512,50  || 2: 682,50  || 3: NaN
//4: 512,180 || 5: 682,180 || 6: 852,180
//7: 512,310 || 8: 682,310 || 9: 852,310
//10:512,440 || 11:682,440 || 12:852,440
//13:512,570 || 14:682,570 || 15:852,570 

//to create a captured image of the webcam at the size of 160,120
function saveImage(){
    var imageChosen= capture.get();
    imageChosen.resize(160,120);
    return imageChosen;
}
