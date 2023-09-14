// TODO make line appear and disappear, without moving
// TODO make lines animate/rotate around root point
// TODO V to toggle variables
// TODO key numbers for color themes; add colors to filename
// TODO make version with sliders/checkboxes
// TODO put online in page


// Set variables:
// Number of line rotations per round (when mouseX not interactive). Example values: -5, -2, 0, 1, 2.5, 5.2, 13...
let lineRotations = 5;
// Number of rounds (full circle); adapt when lineRotations are not integers (eg. 2.5 needs 2 rounds to close)
let rounds = 1;
let linesCount = 200;
let lineLength = 160;   // length of line (when mouseY not interactive)
let lineWeight = 1;
let randomPositionMax = 12;     // limit of random position (in px), 0 for none
let randomAngleMax = 6;         // limit of random angle (in degrees), 0 for none
let circleDiam = 400;


let lineColor;
let backgroundColor;
let isRandomized = false;
let randomShiftPosX = 0;
let randomShiftPosY = 0;
let randomShiftAngle = 0;
let newLength;
let variablesAreVisible = true;
let isInteractiveX = true;
let isInteractiveY = true;
let isDarkMode = true;
let hasSmallCircles = true;
let isCompleteRound = true;
let light;
let dark;


function setup() {
    createCanvas(windowWidth, windowHeight);

    // colors
    light = color('rgb(253, 189, 129)');
    dark = color('rgb(47, 33, 33)');

    strokeCap(SQUARE);
    // noCursor();

    // font properties
    textFont('Helvetica, Arial, sans-serif');
    textSize(12);
    textLeading(20);
}

function draw() {
    // Set color mode
    if (isDarkMode) {
        backgroundColor = dark;
        lineColor = light;
    } else {
        backgroundColor = light;
        lineColor = dark;
    }
    background(backgroundColor);

    // keep fixed random on each draw loop
    randomSeed(0);

    // show variables on the screen 
    fill(lineColor);
    noStroke();
    if (variablesAreVisible) { showVariables(); }

    // interactive mode, dynamic values replacing fixed values
    if (isInteractiveX) {
        // Map mouseX position to line rotations: choose one of two versions
        if (isCompleteRound) {
            // Version 1: exact full rounds, symmetrical shapes, static "jumps"
            lineRotations = int(map(mouseX, 0, width, -8, 8));
        } else {
            // Version 2: moving last line, creating continuous waves/leafs
            lineRotations = Math.round(map(mouseX, 0, width, -8, 8) * 100) / 100;
        }
    }
    if (isInteractiveY) {
        lineLength = int(map(mouseY, 0, height, 600, 0));
    }

    stroke(lineColor);
    strokeWeight(lineWeight);
    // position to center, rotate upwards, then start drawing the lines
    translate(width / 2, height / 2);
    rotate(-radians(90));
    drawLines();
}

function drawLines() {
    // draw each line
    for (let i = 0; i < linesCount * rounds; i++) {
        // Random shift, if any
        if (isRandomized) {
            randomShiftPosX = random(-randomPositionMax, randomPositionMax);
            randomShiftPosY = random(-randomPositionMax, randomPositionMax);
            randomShiftAngle = random(-randomAngleMax, randomAngleMax);
        } else {
            randomShiftAngle = 0;
            randomShiftPosX = 0;
            randomShiftPosY = 0;
        }

        push();
        // rotate to next point on circle, move to it, rotate, draw the line
        // one segment = TWO_PI / linesCount (do not calculate separately)
        rotate(TWO_PI / linesCount * i);
        translate(circleDiam / 2, 0);
        rotate(TWO_PI / linesCount * lineRotations * i + radians(randomShiftAngle));
        line(0 + randomShiftPosX, 0 + randomShiftPosY, lineLength + randomShiftPosX, 0 + randomShiftPosY);
        if (hasSmallCircles) {
            fill(lineColor);
            circle(lineLength + randomShiftPosX, 0 + randomShiftPosY, 4);
        }
        pop();

    }
}

function keyReleased() {
    // Press S to save and download; will add variables to file name
    if (key === 's' || key === 'S') {
        let filename = '';
        filename += `mCircle`;
        filename += `-lineRotations${lineRotations}`;
        filename += `-rounds${rounds}`;
        filename += `-linesCount${linesCount}`;
        filename += `-lineLength${lineLength}`;
        filename += `-lineWeight${lineWeight}`;
        filename += `-circleDiam${circleDiam}`;
        filename += `-isRandom${isRandomized}`;
        if (isRandomized) {
            filename += `-randomPos${randomPositionMax}`;
            filename += `-randomAngle${randomAngleMax}`;
        }
        saveCanvas(filename, 'png')
    }

    // Press V to toggle text of variables/help instructions on the canvas
    if (key === 'v' || key === 'V' || key === '?') { variablesAreVisible = !variablesAreVisible; }

    // Press R to toggle randomness
    if (key === 'r' || key === 'R') { isRandomized = !isRandomized; }

    // Press Space to toggle transitioning/morphing shapes (complete rounds)
    if (key === ' ') { isCompleteRound = !isCompleteRound; }

    // Press D or L to toggle dark/light mode
    if (key === 'd' || key === 'D' || key === 'l' || key === 'L') { isDarkMode = !isDarkMode; }

    // Press X (or Y) to toggle interactivity of mouse X (Y) position 
    if (key === 'x' || key === 'X') { isInteractiveX = !isInteractiveX; }
    if (key === 'y' || key === 'Y') { isInteractiveY = !isInteractiveY; }

    // Press C to toggle the small circles
    if (key === 'c' || key === 'C') { hasSmallCircles = !hasSmallCircles; }

    // Press arrow up/down to increase/decrease complete rounds
    // if (keyCode === UP_ARROW && !isCompleteRound) {
    //     rounds++;
    // } else if (keyCode === DOWN_ARROW && !isCompleteRound) {
    //     if (rounds > 1) {
    //         rounds--;
    //     }
    // }

    return false;
}

// Show text (instructions and variables) in top left corner of canvas
function showVariables() {
    let varText = '';
    varText += `Press ? to toggle these instructions\n\n`;
    varText += `Press Space to toggle matching start/end line\n`;
    varText += `Press X to toggle mouse X interaction (line rotations)\n`;
    varText += `Press Y to toggle mouse Y interaction (line length)\n`;
    varText += `Press R to toggle randomized position\n`;
    varText += `Press C to toggle small circles\n`;
    varText += `Press D to toggle dark mode\n`;
    varText += `Press S to save as PNG image\n`;
    varText += `\n`;
    varText += `lineRotations ${lineRotations}\n`;
    varText += `rounds ${rounds}\n`;
    varText += `linesCount ${linesCount}\n`;
    varText += `lineLength ${lineLength}\n`;
    varText += `lineWeight ${lineWeight}\n`;
    varText += `circleDiam ${circleDiam}\n`;
    varText += `isRandomPlacement ${isRandomized}\n`;
    if (isRandomized) {
        varText += `randomPosition ${randomPositionMax}\n`;
        varText += `randomAngle ${randomAngleMax}\n`;
    }
    text(varText, 10, 30);
}

// Redraw when browser window is resized
function windowResized() {
    setup();
    draw();
}
