// Set variables:

// Number of 360° line rotations per round (when mouseX is not interactive)
let lineRotations;
let lineRotationsFraction;
let rounds;
let lines = 200;
let lineLength = 160;

let lineWeight = 1;
let circleDiam = 400;
let smallCircleDiam = 3;
let positionIsRandomized = false;
let randomPositionMax = 12;
let randomAngleMax = 6;
let variablesAreVisible = false;
let isDarkMode = true;
let hasSmallCircles = true;
let isInteractive = false;

let isFullRotationPerRound = false;
let lineColor;
let backgroundColor;
let light;
let dark;
let colorThemes = [
    { light: 'rgb(200, 200, 200)', dark: 'rgb(30, 30, 30)' }, // 0 gray (default)
    { light: 'rgb(204, 204, 204)', dark: 'rgb(168, 168, 168)' }, // light gray
    { light: 'rgb(223, 186, 225)', dark: 'rgb(55, 45, 55)' }, // pink
    { light: 'rgb(254, 42, 42)', dark: 'rgb(5, 4, 5)' }, // red black
    { light: 'rgb(184, 250, 239)', dark: 'rgb(37, 48, 45)' }, // teal
    { light: 'rgb(161, 225, 87)', dark: 'rgb(35, 44, 33)' }, // green
    { light: 'rgb(236, 215, 109)', dark: 'rgb(49, 45, 38)' }, // yellow
    { light: 'rgb(255, 223, 136)', dark: 'rgb(47, 70, 132)' }, // blue yellow
    { light: 'rgb(201, 229, 241)', dark: 'rgb(35, 54, 103)' }, // blue
    { light: 'rgb(253, 189, 129)', dark: 'rgb(47, 33, 33)' }, // dark brown
];
let indexTheme;
let randomShiftPosX;
let randomShiftPosY;
let randomShiftAngle;
let sliderRotations;
let sliderRotationsFraction;
let sliderLineLength;
let sliderLines;


function setup() {
    createCanvas(windowWidth, windowHeight);

    // default colors
    indexTheme = 0;
    light = colorThemes[indexTheme].light;
    dark = colorThemes[indexTheme].dark;

    strokeCap(SQUARE);
    // noCursor();

    // font properties
    textFont('Helvetica, Arial, sans-serif');
    textSize(12);
    textLeading(20);

    // sliders etc
    sliderRotations = createSlider(-24, 24, 3);
    sliderRotations.position(width - 200, 20);
    sliderRotations.style('width', '180px');

    sliderRotationsFraction = createSlider(0, 9, 0, 1);
    sliderRotationsFraction.position(width - 200, 50);
    sliderRotationsFraction.style('width', '180px');

    sliderLineLength = createSlider(1, 600, 150);
    sliderLineLength.position(width - 200, 80);
    sliderLineLength.style('width', '180px');

    sliderLines = createSlider(12, 800, 200);
    sliderLines.position(width - 200, 110);
    sliderLines.style('width', '180px');
}

function draw() {
    // keep fixed randomness on each draw loop
    randomSeed(0);

    // Set colors
    setColors();

    // show variables on the screen 
    fill(lineColor);
    noStroke();
    if (variablesAreVisible) { showVariables(); }

    // interactive mode, dynamic values replacing fixed values
    if (isInteractive) {
        // Map mouseX position to line rotations: choose one of two versions
        if (isFullRotationPerRound) {
            // Version 1: exact full rounds, symmetrical shapes, static "jumps"
            lineRotations = int(map(mouseX, 0, width, -8, 8));
        } else {
            // Version 2: moving last line, creating continuous waves/leafs
            lineRotations = Math.round(map(mouseX, 0, width, -8, 8) * 100) / 100;
        }
        // Map mouseY position to line length
        lineLength = int(map(mouseY, 0, height, 600, 0));
    } else {
        // use slider values
        lineLength = sliderLineLength.value();
        lines = sliderLines.value();
        lineRotationsFraction = sliderRotationsFraction.value();
        lineRotations = sliderRotations.value() + lineRotationsFraction / 10;
        // get number of rounds for complete shapes
        switch (lineRotationsFraction) {
            case 1:
            case 3:
            case 7:
            case 9:
                rounds = 10;
                break;
            case 2:
            case 4:
            case 6:
                rounds = 5;
                break;
            case 5:
                rounds = 2;
                break;
            case 8:
                rounds = 7;
                break;
            default:
                rounds = 1;
        }
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
    for (let i = 0; i < lines * rounds; i++) {
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
        rotate(TWO_PI / lines * i);
        translate(circleDiam / 2, 0);
        rotate(TWO_PI / lines * lineRotations * i + radians(randomShiftAngle));
        line(0 + randomShiftPosX, 0 + randomShiftPosY, lineLength + randomShiftPosX, 0 + randomShiftPosY);
        if (hasSmallCircles) {
            fill(lineColor);
            circle(lineLength + randomShiftPosX, 0 + randomShiftPosY, smallCircleDiam);
        }
        pop();

    }
}

// Set colors
function setColors() {
    light = colorThemes[indexTheme].light;
    dark = colorThemes[indexTheme].dark;
    if (isDarkMode) {
        backgroundColor = dark;
        lineColor = light;
    } else {
        backgroundColor = light;
        lineColor = dark;
    }
    background(backgroundColor);
    sliderRotations.style('background', light);
    sliderRotationsFraction.style('background', light);
    sliderLineLength.style('background', light);
    sliderLines.style('background', light);
}

// Press a key to change behavior or save (not working in online editor)
function keyReleased() {
    // Press S to save and download; will add variables to file name
    if (key === 's' || key === 'S') {
        let filename = '';
        filename += `mCircle`;
        filename += `-lineRotations${lineRotations}`;
        filename += `-rounds${rounds}`;
        filename += `-lineCount${lines}`;
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

    // Press Space to toggle fluid transition (vs static rounds)
    if (key === 'f' || key === 'F') { isFullRotationPerRound = !isFullRotationPerRound; }

    // Press D or L to toggle dark/light mode
    if (key === 'd' || key === 'D' || key === 'l' || key === 'L') { isDarkMode = !isDarkMode; }

    // Press X (or Y) to toggle interactivity of mouse X (Y) position 
    if (key === ' ') { isInteractive = !isInteractive; }

    // Press C to toggle the small circles
    if (key === 'c' || key === 'C') { hasSmallCircles = !hasSmallCircles; }

    // Press a number to change color theme
    if (key === '1') { indexTheme = 1; }
    if (key === '2') { indexTheme = 2; }
    if (key === '3') { indexTheme = 3; }
    if (key === '4') { indexTheme = 4; }
    if (key === '5') { indexTheme = 5; }
    if (key === '6') { indexTheme = 6; }
    if (key === '7') { indexTheme = 7; }
    if (key === '8') { indexTheme = 8; }
    if (key === '9') { indexTheme = 9; }
    if (key === '0') { indexTheme = 0; }

    return false;
}

// Show text in top left corner of canvas
function showVariables() {
    let varText = '';
    varText += `Press ? to toggle these instructions\n\n`;
    varText += `Press F to toggle fluid transitions\n`;
    varText += `Press Space to toggle mouse X/Y interactions\n`;
    varText += `Press R to toggle randomized position\n`;
    varText += `Press C to toggle small circles\n`;
    varText += `Press 1-9 to change color theme\n`;
    varText += `Press D to toggle dark/light color mode\n`;
    varText += `Press S to save as PNG image\n`;
    varText += `\n`;
    varText += `lineRotations ${lineRotations}\n`;
    varText += `rounds ${rounds}\n`;
    varText += `lineCount ${lines}\n`;
    varText += `lineLength ${lineLength}\n`;
    varText += `lineWeight ${lineWeight}\n`;
    varText += `circleDiam ${circleDiam}\n`;
    varText += `positionIsRandomized ${positionIsRandomized}\n`;
    if (positionIsRandomized) {
        varText += `randomPosition ${randomPositionMax}\n`;
        varText += `randomAngle ${randomAngleMax}\n`;
    }
    varText += `colorDark ${dark}\n`;
    varText += `colorLight ${light}\n`;
    text(varText, 10, 30);
}

// Redraw when browser window is resized (not working in online editor)
function windowResized() {
    setup();
    draw();
}
