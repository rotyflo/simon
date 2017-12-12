"use strict";

const BUTTONS = { red, blue, yellow, green };
const COLORS = Object.keys(BUTTONS);
const ON_OPACITY = "1";
const OFF_OPACITY = "0.6";
const BEEP_INTERVAL = 750;
const NOTIFICATION_TIME = 1000;
const TURN_INDICATOR = document.getElementById("turn");
const MODE = document.getElementById("mode");
const START = document.getElementById("start");
let gamePattern = [];
let playerPattern = [];
let strictMode = false;

// BUTTON FUNCTIONALITY
for (const color in BUTTONS) {
  BUTTONS[color].element = document.getElementById(color);
  BUTTONS[color].audio = new Audio(`./media/${color}.mp3`);

  BUTTONS[color].element.addEventListener("click", function () {
    playerPattern.push(color);
    BUTTONS[color].audio.currentTime = 0;
    BUTTONS[color].audio.play();

    let pp = JSON.stringify(playerPattern);
    let gp = JSON.stringify(gamePattern);

    // INCORRECT ANSWER
    if (pp !== gp.slice(0, pp.length - 1) + "]") {
      let turn = TURN_INDICATOR.innerText;
      TURN_INDICATOR.innerText = gamePattern == false ? "Press Start" : "Wrong";

      setTimeout(function () {
        if (strictMode) {
          restartGame();
        }
        else {
          TURN_INDICATOR.innerText = turn;
          playerPattern = [];

          indicatePattern();
        }
      }, NOTIFICATION_TIME);
    }

    // CORRECT ANSWER
    if (pp == gp) {
      TURN_INDICATOR.innerText = Number(TURN_INDICATOR.innerText) + 1;
      playerPattern = [];

      if (TURN_INDICATOR.innerText == 20) {
        TURN_INDICATOR.innerText = "Winner!";

        setTimeout(function () {
          restartGame();
        }, NOTIFICATION_TIME);
      }
      else {
        addRandomColorToPattern();
        indicatePattern();
      }
    }
  });
}

MODE.addEventListener("click", function () {
  MODE.innerText = strictMode ? "Easy Mode" : "Strict Mode";
  strictMode = strictMode ? false : true;
});

START.addEventListener("click", function () {
  document.getElementById("autoplay-fix").style.display = "none";
  restartGame();
});

//------------------------FUNCTIONALITY----------------------------//

function restartGame() {
  gamePattern = [];
  playerPattern = [];
  TURN_INDICATOR.innerText = "Loading...";

  setTimeout(function () {
    TURN_INDICATOR.innerText = 0;

    addRandomColorToPattern();
    indicatePattern();
  }, NOTIFICATION_TIME);
}

function addRandomColorToPattern() {
  let randomNum = Math.floor(Math.random() * COLORS.length);

  gamePattern.push(COLORS[randomNum]);
}

function indicatePattern() {
  let interval = BEEP_INTERVAL;

  disableButtons();

  gamePattern.forEach(function (color) {
    let element = BUTTONS[color].element;

    setTimeout(function () {
      element.style.opacity = ON_OPACITY;
      BUTTONS[color].audio.currentTime = 0;
      BUTTONS[color].audio.play();

      BUTTONS[color].audio.addEventListener("ended", function () {
        element.style.opacity = OFF_OPACITY;
      });
    }, interval);

    interval += BEEP_INTERVAL;
  });

  setTimeout(function() {
    enableButtons();
  }, interval);
}

function disableButtons() {
  COLORS.forEach(function(color) {
    document.getElementById(color).disabled = true;
  });
}

function enableButtons() {
  COLORS.forEach(function(color) {
    document.getElementById(color).disabled = false;
  });
}