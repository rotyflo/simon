"use strict";

const BUTTONS = {red, blue, yellow, green};
const COLORS = Object.keys(BUTTONS);
const ON_OPACITY = "1";
const OFF_OPACITY = "0.6";
const BEEP_INTERVAL = 750;
let gamePattern = [];
let playerPattern = [];

// BUTTON FUNCTIONALITY
for (const color in BUTTONS) {
  BUTTONS[color].element = document.getElementById(color);
  BUTTONS[color].audio = new Audio(`./media/${color}.mp3`);

  BUTTONS[color].element.addEventListener("click", function() {
    playerPattern.push(color);
    BUTTONS[color].audio.play();
  });
}

randomPattern(3);
indicatePattern();

// GENERATE RANDOM PATTERN OF COLORS
function randomPattern(numOfColors) {
  for (let i = 0; i < numOfColors; i++) {
    let randomNum = Math.floor(Math.random() * COLORS.length);
    let randomButton = COLORS[randomNum];

    gamePattern.push(randomButton);
  }
}

// VISUALIZE PATTERN VIA BUTTON FLASHES AND BEEPS
function indicatePattern() {
  let interval = BEEP_INTERVAL;

  gamePattern.forEach(function (color) {
    let element = BUTTONS[color].element;

    setTimeout(function () {
      element.style.opacity = ON_OPACITY;
      BUTTONS[color].audio.play();
      
      BUTTONS[color].audio.addEventListener("ended", function() {
        element.style.opacity = OFF_OPACITY;
      });
    }, interval);

    interval += BEEP_INTERVAL;
  });
}