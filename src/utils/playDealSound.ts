import cardDrawSound1 from "/dealcard1.mp3";
import cardDrawSound2 from "/dealcard2.mp3";
// import cardDrawSound3 from "/dealcard3.mp3";

const soundPool: HTMLAudioElement[] = [];
const soundPoolSize = 10;
let currentSoundIndex = 0;

for (let i = 0; i < soundPoolSize; i++) {
  const sounds = [cardDrawSound1, cardDrawSound2];
  const sound = new Audio(sounds[Math.floor(Math.random() * sounds.length)]);
  soundPool.push(sound);
}

function playSound() {
  const sfx = soundPool[currentSoundIndex];
  currentSoundIndex = (currentSoundIndex + 1) % soundPoolSize;
  sfx.preservesPitch = false;
  const varianceRange = 0.25;
  const variance = Math.random() * varianceRange - varianceRange / 2;
  sfx.volume = 0.4 + variance;
  sfx.playbackRate = 1 + variance;
  sfx.play();
}

export default playSound;
