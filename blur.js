function blur(capture,size){
    //to create a separate copy of the input image.
    var imageBlur = capture.get();
    imageBlur.loadPixels();

    //generate a matrix for blurring
    //essentially, to let a pixel know how much 'weight' it has in influencing the outcome colour 
    //of the blur, since the outcome colour will be applied to the centre pixels in the section calculated.
    var matrix = simpleBlurMatrix(size);

    //to set a limit on where to start the blurring process
    //considering that eg a 3x3 matrix,it is best to start blurring at the pixel coord of (1,1) which is the center of the matrix,
    //cause if i start at (0,0), a section of the matrix will not have a pixel to calculate the avg colour values
    //for example of starting at (0,0) for 3x3 matrix
    //[[null , null  , null ],   
    // [null , (0,0) , (1,0)],
    // [nul  , (0,1) , (1,1)]]
    //from past experience, this might skew the img to have a darker blur from unbalanced blurring
    //since the pixel colour value outside of an image is 0,0,0,0 in the format of R,G,B,A
    const offset = floor((matrix.length/2));
    var startingY = offset, startingX = offset;
    var limitY = imageBlur.height - offset, limitX = imageBlur.width - offset;

    //to interate over all 'centre' pixels to be blurred
    for (var y = startingY;y<limitY;y++){
        for (var x = startingX; x<limitX;x++){
            var index = ((imageBlur.width*y)+x)*4;
            //explanation below
            let c = blurring(x,y,matrix,matrix.length,offset,imageBlur.height,imageBlur);

            //apply the returned avg colour to the centre pixel
            imageBlur.pixels[index+0] = c[0];
            imageBlur.pixels[index+1] = c[1];
            imageBlur.pixels[index+2] = c[2];

        }
    }

    //once all of the centres pixels have their colour values averaged, save the img and return it to display.
    imageBlur.updatePixels();
    return imageBlur;
}

//to create a simple square matrix
//for example, if the input is 3, this will create a 3x3 matrix.
//[[1/9 , 1/9 , 1/9],
// [1/9 , 1/9 , 1/9],
// [1/9 , 1/9 , 1/9]]
//so considering the input of 40 (from floor(160/4) = 40) in sketch.js, will create a 40 x 40 matrix filled with 1/1600.
function simpleBlurMatrix(size){
    var column= [];
    for (var i = 0; i<size;i++){
        var row = [];
        for (var o = 0; o<size;o++){
            row.push(1/(size*size));
        }
        column.push(row);
    }
    return column;
}

//to iterate over all of the pixels within a set range, to calculate avg colour based on the simple matrix.
function blurring(ogx,ogy,matrix,matrixSize,offset,imgHeight,capture){
    //since this function is called multiple time, this will reset the total RGB value for the new calculation.
    var redSum = 0;
    var greenSum = 0;
    var blueSum = 0;

    //to iterate over the pixels
    for (var y = 0;y<matrixSize ;y++){
        for (var x = 0; x < matrixSize ;x++){
            //find their appropriate coords
            var xCoord = ogx + x - offset;
            var yCoord = ogy + y - offset;
            var index = ((imgHeight*yCoord)+xCoord)*4;

            //to sum the colour values of all pixels within the range
            redSum +=  capture.pixels[index + 0] * matrix[y][x];
            greenSum +=  capture.pixels[index + 1] * matrix[y][x];
            blueSum +=  capture.pixels[index + 2] * matrix[y][x];
        }
    }

    //return the colour values
    return [redSum,greenSum,blueSum];
}