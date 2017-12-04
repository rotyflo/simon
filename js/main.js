"use strict";

const GAME = {
  colors: ["red", "blue", "yellow", "green"],
  onOpacity: "1",
  offOpacity: "0.8",
  indicationSpeed: 750
};
const BUTTONS = {
  red: {
    element: document.getElementById("red"),
    audio: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound1.mp3"),
  },
  blue: {
    element: document.getElementById("blue"),
    audio: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound2.mp3"),
  },
  yellow: {
    element: document.getElementById("yellow"),
    audio: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound3.mp3"),
  },
  green: {
    element: document.getElementById("green"),
    audio: new Audio("https://s3.amazonaws.com/freecodecamp/simonSound4.mp3"),
  }
};
let gamePattern = [];
let playerPattern = [];

randomPattern(3);
indicatePattern();

// BUTTON FUNCTIONALITY
for (const color in BUTTONS) {
  BUTTONS[color].element.addEventListener("click", function() {
    playerPattern.push(color);
    BUTTONS[color].audio.play();
  });
}

// GENERATE RANDOM PATTERN OF COLORS
function randomPattern(numOfColors) {
  for (let i = 0; i < numOfColors; i++) {
    let randomNum = Math.floor(Math.random() * GAME.colors.length);
    let randomButton = GAME.colors[randomNum];

    gamePattern.push(randomButton);
  }
}

// VISUALIZE PATTERN VIA BUTTON FLASHES AND BEEPS
function indicatePattern() {
  let interval = 0;

  gamePattern.forEach(function (color) {
    let element = BUTTONS[color].element;

    setTimeout(function () {
      element.style.opacity = GAME.onOpacity;
      BUTTONS[color].audio.play();
      
      BUTTONS[color].audio.addEventListener("ended", function() {
        element.style.opacity = GAME.offOpacity;
      });
    }, interval);

    interval += GAME.indicationSpeed;
  });
}