// Set variables:

// Number of line rotations per round (when mouseX is not interactive)
// Example values: -5, -2, 0, 1, 2.5, 5.2, 13...
let lineRotations = 5;

// Number of full circle rounds 
// Adapt when lineRotations are not integers (eg. 2.5 needs 2 rounds to fully close)
let rounds = 1;

let lineCount = 200;
let lineLength = 160;
let lineWeight = 1;
let circleDiam = 400;
let positionIsRandomized = false;
let randomPositionMax = 12;
let randomAngleMax = 6;
let variablesAreVisible = true;
let isDarkMode = true;
let hasSmallCircles = true;
let isFullRotationPerRound = true;

let xIsInteractive = true;
let yIsInteractive = true;

let lineColor;
let backgroundColor;
let light;
let dark;
let randomShiftPosX;
let randomShiftPosY;
let randomShiftAngle;


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
    // Set colors
    if (isDarkMode) {
        backgroundColor = dark;
        lineColor = light;
    } else {
        backgroundColor = light;
        lineColor = dark;
    }
    background(backgroundColor);

    // keep fixed randomness on each draw loop
    randomSeed(0);

    // show variables on the screen 
    fill(lineColor);
    noStroke();
    if (variablesAreVisible) { showVariables(); }

    // interactive mode, dynamic values replacing fixed values
    if (xIsInteractive) {
        // Map mouseX position to line rotations: choose one of two versions
        if (isFullRotationPerRound) {
            // Version 1: exact full rounds, symmetrical shapes, static "jumps"
            lineRotations = int(map(mouseX, 0, width, -8, 8));
        } else {
            // Version 2: moving last line, creating continuous waves/leafs
            lineRotations = Math.round(map(mouseX, 0, width, -8, 8) * 100) / 100;
        }
    }
    if (yIsInteractive) {
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
    for (let i = 0; i < lineCount * rounds; i++) {
        // Random shift, if any
        if (positionIsRandomized) {
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
        rotate(TWO_PI / lineCount * i);
        translate(circleDiam / 2, 0);
        rotate(TWO_PI / lineCount * lineRotations * i + radians(randomShiftAngle));
        line(0 + randomShiftPosX, 0 + randomShiftPosY, lineLength + randomShiftPosX, 0 + randomShiftPosY);
        if (hasSmallCircles) {
            fill(lineColor);
            circle(lineLength + randomShiftPosX, 0 + randomShiftPosY, 4);
        }
        pop();

    }
}

// Press a key to change behavior or save (not working in online editor)
function keyReleased() {
    // Press S to save and download; will add variables to file name
    if (key === 's' || key === 'S') {
        let filename = '';
        filename += `mCircle`;
        filename += `-lineRotations${lineRotations}`;
        filename += `-rounds${rounds}`;
        filename += `-lineCount${lineCount}`;
        filename += `-lineLength${lineLength}`;
        filename += `-lineWeight${lineWeight}`;
        filename += `-circleDiam${circleDiam}`;
        filename += `-posIsRandom${positionIsRandomized}`;
        if (positionIsRandomized) {
            filename += `-randomPos${randomPositionMax}`;
            filename += `-randomAngle${randomAngleMax}`;
        }
        saveCanvas(filename, 'png')
    }

    // Press V to toggle text of variables/help instructions on the canvas
    if (key === 'v' || key === 'V' || key === '?') { variablesAreVisible = !variablesAreVisible; }

    // Press R to toggle randomness
    if (key === 'r' || key === 'R') { positionIsRandomized = !positionIsRandomized; }

    // Press Space to toggle transitioning/morphing shapes (complete rounds)
    if (key === ' ') { isFullRotationPerRound = !isFullRotationPerRound; }

    // Press D or L to toggle dark/light mode
    if (key === 'd' || key === 'D' || key === 'l' || key === 'L') { isDarkMode = !isDarkMode; }

    // Press X (or Y) to toggle interactivity of mouse X (Y) position 
    if (key === 'x' || key === 'X') { xIsInteractive = !xIsInteractive; }
    if (key === 'y' || key === 'Y') { yIsInteractive = !yIsInteractive; }

    // Press C to toggle the small circles
    if (key === 'c' || key === 'C') { hasSmallCircles = !hasSmallCircles; }

    return false;
}

// Show text in top left corner of canvas
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
    varText += `lineCount ${lineCount}\n`;
    varText += `lineLength ${lineLength}\n`;
    varText += `lineWeight ${lineWeight}\n`;
    varText += `circleDiam ${circleDiam}\n`;
    varText += `isRandomPlacement ${positionIsRandomized}\n`;
    if (positionIsRandomized) {
        varText += `randomPosition ${randomPositionMax}\n`;
        varText += `randomAngle ${randomAngleMax}\n`;
    }
    text(varText, 10, 30);
}

// Redraw when browser window is resized (not working in online editor)
function windowResized() {
    setup();
    draw();
}
