"use strict";

const BUTTONS = { red, blue, yellow, green };
const COLORS = Object.keys(BUTTONS);
const ON_OPACITY = "1";
const OFF_OPACITY = "0.6";
const BEEP_INTERVAL = 1000;
const NOTIFICATION_TIME = 1000;
const TURN_INDICATOR = document.getElementById("turn");
const MODE = document.getElementById("mode");
const START = document.getElementById("start");
const SOUNDS = {
  red: makeSineWave(400),
  blue: makeSineWave(420),
  green: makeSineWave(440),
  yellow: makeSineWave(480)
}
let gamePattern = [];
let playerPattern = [];
let strictMode = false;



function playSound({ array, sampleRate }) {
  // We have to start with creating AudioContext
  const audioContext = new AudioContext({ sampleRate });
  // create audio buffer of the same length as our array
  const audioBuffer = audioContext.createBuffer(1, array.length, sampleRate);
  // this copies our sine wave to the audio buffer
  audioBuffer.copyToChannel(array, 0);
  // some JavaScript magic to actually play the sound
  const source = audioContext.createBufferSource();
  source.connect(audioContext.destination);
  source.buffer = audioBuffer;
  source.start();
  console.log(array);
}

function makeSineWave(hz) {
  // to play 1 second we need array of 44100 numbers
  const sampleRate = 44100;

  // create a typed array of size 44100 float numbers
  const sineWaveArray = new Float32Array(sampleRate);

  // fill all 44100 elements of array with Math.sin() values
  for (let i = 0; i < sineWaveArray.length; i++) {
    sineWaveArray[i] = Math.sin(i * Math.PI * 8 / hz);
  }

  return { array: sineWaveArray, sampleRate };
}

function showElement(element) {
  element.style.display = "initial";
}



// BUTTON FUNCTIONALITY
for (const color in BUTTONS) {
  BUTTONS[color].element = document.getElementById(color);

  BUTTONS[color].element.addEventListener("click", function () {
    playerPattern.push(color);

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

        setTimeout(function() {
          indicatePattern();
        }, BEEP_INTERVAL);
      }
    }
  });
}

MODE.addEventListener("click", function () {
  MODE.innerText = strictMode ? "Easy Mode" : "Strict Mode";
  strictMode = strictMode ? false : true;
});

START.addEventListener("click", function () {
  restartGame();
});

//------------------------FUNCTIONALITY----------------------------//

function restartGame() {
  gamePattern = [];
  playerPattern = [];
  TURN_INDICATOR.innerText = "0";

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
      element.style.background = "white";
      playSound(SOUNDS[color]);
      setTimeout(function () {
        element.style.background = `var(--${color})`;
      }, BEEP_INTERVAL);
    }, interval);

    interval += BEEP_INTERVAL;
  });

  setTimeout(function () {
    enableButtons();
  }, interval);
}

function disableButtons() {
  COLORS.forEach(function (color) {
    document.getElementById(color).disabled = true;
  });
}

function enableButtons() {
  COLORS.forEach(function (color) {
    document.getElementById(color).disabled = false;
  });
}