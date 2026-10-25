// ---------- Elements ----------
let player = document.getElementById("player");
let playBtn = document.getElementById("playBtn");
let pauseBtn = document.getElementById("pauseBtn");
let stopBtn = document.getElementById("stopBtn");
let volUpBtn = document.getElementById("volUpBtn");
let volDownBtn = document.getElementById("volDownBtn");
let message = document.getElementById("message");
let caption = document.getElementById("caption");
let progressFill = document.getElementById("progress-fill");
let markers = document.querySelectorAll(".marker");

// ---------- Times of day ----------
// "start" is the second in the soundscape where each part begins.
let scenes = [
  {
    name: "morning",
    start: 0,
    text: "Morning · pigeon whistles circle above the rooftops",
  },
  { name: "day", start: 20, text: "Afternoon · the hutong comes alive" },
  { name: "evening", start: 45, text: "Evening · an erhu plays in the park" },
  { name: "night", start: 65, text: "Night · crickets and quiet alleys" },
];

let currentScene = "morning";
let volume = 1.0;

// ---------- Button events ----------
playBtn.addEventListener("click", playAudio);
pauseBtn.addEventListener("click", pauseAudio);
stopBtn.addEventListener("click", stopAudio);
volUpBtn.addEventListener("click", volumeUp);
volDownBtn.addEventListener("click", volumeDown);

// clicking a time-of-day marker jumps to that part of the soundscape
for (let i = 0; i < markers.length; i++) {
  markers[i].addEventListener("click", markerClicked);
}

// ---------- Audio events ----------
player.addEventListener("loadedmetadata", placeMarkers);
player.addEventListener("play", playerStarted);
player.addEventListener("timeupdate", playerProgressed);
player.addEventListener("ended", playerEnded);

// place markers right away (using an estimated length),
// then again once the real audio length is known
placeMarkers();

// ---------- Controls ----------
function playAudio() {
  player.play();
}

function pauseAudio() {
  player.pause();
}

function stopAudio() {
  player.pause();
  player.currentTime = 0;
  changeScene(scenes[0]);
  setCaption("Press play to begin.");
  progressFill.style.width = "0%";
  updateMessage();
}

function volumeUp() {
  volume += 0.1;
  if (volume > 1.0) {
    volume = 1.0;
  }
  player.volume = volume;
  updateMessage();
}

function volumeDown() {
  volume -= 0.1;
  if (volume < 0.0) {
    volume = 0.0;
  }
  player.volume = volume;
  updateMessage();
}

function markerClicked(event) {
  let name = event.target.dataset.scene;
  for (let i = 0; i < scenes.length; i++) {
    if (scenes[i].name === name) {
      player.currentTime = scenes[i].start;
    }
  }
  player.play();
}

// ---------- Event handlers ----------
function playerStarted() {
  // when playback starts (or restarts), show the caption for the current part
  let scene = findScene(player.currentTime);
  changeScene(scene);
}

function playerProgressed() {
  // 1. find which time of day we are in, and switch if it changed
  let scene = findScene(player.currentTime);
  if (scene.name !== currentScene) {
    changeScene(scene);
  }

  // 2. move the progress bar
  if (player.duration) {
    let percent = (player.currentTime / player.duration) * 100;
    progressFill.style.width = percent + "%";
  }

  // 3. update the time / volume text
  updateMessage();
}

function playerEnded() {
  setCaption("The day is over. Good night, Beijing.");
  progressFill.style.width = "100%";
}

// ---------- Helpers ----------

// returns the scene that matches the given time (in seconds)
function findScene(time) {
  let result = scenes[0];
  for (let i = 0; i < scenes.length; i++) {
    if (time >= scenes[i].start) {
      result = scenes[i];
    }
  }
  return result;
}

// switches the image, background colour, marker and caption
function changeScene(scene) {
  currentScene = scene.name;

  // hide all images, then show the matching one
  let images = document.querySelectorAll(".scene");
  for (let i = 0; i < images.length; i++) {
    images[i].classList.remove("active");
  }
  document.getElementById("scene-" + scene.name).classList.add("active");

  // highlight the matching marker
  for (let i = 0; i < markers.length; i++) {
    if (markers[i].dataset.scene === scene.name) {
      markers[i].classList.add("active");
    } else {
      markers[i].classList.remove("active");
    }
  }

  // background colour
  document.body.className = scene.name;

  setCaption(scene.text);
}

// puts each marker under the progress bar at the time its scene starts
function placeMarkers() {
  let length = player.duration || 80;
  for (let i = 0; i < markers.length; i++) {
    for (let j = 0; j < scenes.length; j++) {
      if (scenes[j].name === markers[i].dataset.scene) {
        markers[i].style.left = (scenes[j].start / length) * 100 + "%";
      }
    }
  }
}

// fades the caption out, changes the text, fades it back in
function setCaption(text) {
  caption.classList.add("fade");
  setTimeout(function () {
    caption.innerHTML = text;
    caption.classList.remove("fade");
  }, 600);
}

function updateMessage() {
  let minutes = Math.floor(player.currentTime / 60);
  let seconds = Math.floor(player.currentTime) - minutes * 60;
  if (seconds < 10) {
    seconds = "0" + seconds;
  }
  message.innerHTML = minutes + ":" + seconds;
  message.innerHTML +=
    " &nbsp;·&nbsp; Vol " + Math.round(player.volume * 100) + "%";
}
