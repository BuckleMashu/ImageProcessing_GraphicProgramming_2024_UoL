# ImageProcessing_GraphicProgramming_2024_UoL

This repository contains a p5.js project developed to explore various image processing techniques and create interactive webcam-based "filter" like extensions. 
The project demonstrates fundamental image manipulation, color space conversions, face detection, and incorporates these into creative, game-like experiences.

The core logic is managed in sketch.js, with distinct functionalities and extensions separated into their own JavaScript files (blur.js, colourspace1.js, 
colourspace2.js, extension1.js, extension2.js, facedetection.js, grayNbright.js, pixelated.js, RGBchannel.js, savingimage.js, extensionMaster.js).

You can view the demo of the code here: https://www.youtube.com/watch?v=O2Q2ODiGESM

Core Image Processing Tasks:

- The main part of the project allows users to "snap" a picture from their webcam, which is then processed through a series of filters and displayed:

    Webcam Capture: Captures a live video stream.

    Image Snapshot: Saves a still frame from the webcam for processing.

    Grayscale & Brightness Adjustment (grayNbright.js): Converts the snapshot to grayscale and increases its brightness.

    RGB Channel Isolation & Thresholding (RGBchannel.js):

        Isolates the Red, Green, and Blue color channels.

        Applies a user-controlled threshold to each isolated channel.

    Color Space Conversion:

        CMYK Conversion (colourspace1.js): Converts RGB to CMYK based on a threshold. Includes a slider to control this threshold.

        YCbCr Conversion (colourspace2.js): Converts RGB to YCbCr (ITU-R BT.601 standard) based on a threshold. Includes a slider for control.

    Face Detection (facedetection.js):

        Uses objectdetect.js (frontalface classifier) to detect faces in the snapshot.

        Extracts the detected face area for further processing or use in extensions.

    Face Filters (Applied to detected face):

        Grayscale & Brighten: Applies the grayscale and brightness filter.

        Blur (blur.js): Applies a custom box blur filter.

        Color Space Convert: Applies CMYK conversion.

        Pixelate (pixelated.js): Applies a pixelation effect after grayscale conversion.

        Users can cycle through these face filters using arrow keys.

    UI Elements: Sliders are provided to control threshold values for various channel operations.

- Interactive Extensions:

The project includes an "extension menu" (extensionMaster.js) allowing users to switch to more elaborate, interactive experiences:

Extension 1: "I Be Poppin'" 3D Cube (extension1.js)

    A creative visualization inspired by the "I be popping bottles" meme.

    Displays images of a person (with the user's detected face superimposed) on the faces of a rotating 3D cube in a WEBGL canvas.

    The cube's rotation, size, background color, and texture opacity change dynamically to the beat of the song "TIRED" by CJ SO COOL.

    Features a heart border overlay that also animates with the tempo.

Extension 2: "Flappy Face" Game (extension2.js)

    A Flappy Bird-style game controlled by the user's head movements.

    The player's character (an angel-winged version of their detected face) moves vertically based on the y-coordinate of their detected face in the webcam feed.

    Features procedurally generated pillar obstacles and a scoring system.

    Includes background music that changes if the player loses.

- Technologies Used:

    JavaScript (p5.js library)

    HTML (for canvas and UI elements)

    objectdetect.js (for face detection)

    Various image and audio assets.
