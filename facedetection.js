var detector;
var classifier = objectdetect.frontalface;// to define which what the detecting will be looking for
var faces;
var face;
var scaleFDmine;

var FD;
var FDEffect = "gray"; //essentially, to initialise the default face filter to display.
var prevFDEffect; // this variable is be used to prevent the face filter  to keep running. (sketch.js)
var processedFace; // to store the output of the face with filter. (sketch.js)

function FDsetup(){
    scaleFDmine = 1.2;
    detector = new objectdetect.detector(160,120,scaleFDmine,classifier);
}

function faceDetectionEdit(capture){
    var imageFD = capture.get();

    faces = detector.detect(imageFD.canvas);
        for (var i =0; i<faces.length;i++){
            face=faces[i];
            if (face[4]>4){
                //after the face is detected, it will save the detected face as an image
                var faceArea = createImage(int(face[2]),int(face[3]));
                let c = imageFD.get(face[0],face[1],face[2],face[3]);
                faceArea.set(0,0,c);

            }
        }
    //and return the detected face. 
    //This will allow the program to be more efficient in term of not needing to run continuously,
    // it will only need to run once to get the face.
    //failed to get a face? try taking another picture. 
    return faceArea;
}
