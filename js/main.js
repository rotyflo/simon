"use strict";

const BUTTONS = {
  red: {
    element: document.getElementById("red"),
    sound: makeSineWave(400)
  },
  blue: {
    element: document.getElementById("blue"),
    sound: makeSineWave(420)
  },
  green: {
    element: document.getElementById("green"),
    sound: makeSineWave(440)
  },
  yellow: {
    element: document.getElementById("yellow"),
    sound: makeSineWave(480)
  }
}
const BEEP_INTERVAL = 500;
const NOTIFICATION_TIME = 1000;
const TURN_INDICATOR = document.getElementById("turn");
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
  source.start(0);
  source.stop(0.25);
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

function activateButton(color) {
  playSound(BUTTONS[color].sound);
  playerPattern.push(color);

  let playerPatternString = JSON.stringify(playerPattern);
  let gamePatternString = JSON.stringify(gamePattern);

  // INCORRECT ANSWER
  if (playerPatternString !== gamePatternString.slice(0, playerPatternString.length - 1) + "]") {
    disableButtons();
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
  if (playerPatternString == gamePatternString) {
    disableButtons();
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
}

function toggleMode() {
  document.getElementById("mode").innerText = strictMode ? "Easy Mode" : "Strict Mode";
  strictMode = strictMode ? false : true;
}

//------------------------FUNCTIONALITY----------------------------//

function restartGame() {
  disableButtons();
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
  let randomNum = Math.floor(Math.random() * Object.keys(BUTTONS).length);

  gamePattern.push(Object.keys(BUTTONS)[randomNum]);
}

function indicatePattern() {
  let interval = BEEP_INTERVAL;

  gamePattern.forEach(function (color) {
    let element = BUTTONS[color].element;

    setTimeout(function () {
      element.style.background = "white";
      playSound(BUTTONS[color].sound);
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
  Object.keys(BUTTONS).forEach(function (color) {
    BUTTONS[color].element.style.pointerEvents = "none";
  });
}

function enableButtons() {
  Object.keys(BUTTONS).forEach(function (color) {
    BUTTONS[color].element.style.pointerEvents = "initial";
  });
}