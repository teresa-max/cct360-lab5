let player = document.getElementById("player");
let playBtn = document.getElementById("playBtn");
let pauseBtn = document.getElementById("pauseBtn");
let stopBtn = document.getElementById("stopBtn");
let message = document.getElementById("message");
let scene = document.getElementById("scene");

playBtn.addEventListener("click", playAudio);
pauseBtn.addEventListener("click", pauseAudio);
stopBtn.addEventListener("click", stopAudio);

player.addEventListener("timeupdate", playerProgressed);

function playAudio() {
  player.play();
}

function pauseAudio() {
  player.pause();
}

function stopAudio() {
  player.currentTime = 0;
  player.pause();
  scene.src = "images/morning.jpg";
}

function playerProgressed() {
  let minutes = Math.floor(player.currentTime / 60);
  let seconds = Math.floor(player.currentTime) - minutes * 60;
  message.innerHTML = "time: " + minutes + ":" + seconds;

  // TODO: add evening and night scenes
  if (player.currentTime >= 20) {
    scene.src = "images/day.jpg";
  } else {
    scene.src = "images/morning.jpg";
  }
}
