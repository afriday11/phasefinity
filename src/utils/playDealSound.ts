import cardDrawSound1 from "/dealcard1.mp3";
import cardDrawSound2 from "/dealcard2.mp3";
// import cardDrawSound3 from "/dealcard3.mp3";

function playSound() {
  const sounds = [cardDrawSound1, cardDrawSound2];
  const sfx = new Audio(sounds[Math.floor(Math.random() * sounds.length)]);
  sfx.preservesPitch = false;
  const varianceRange = 0.25;
  const variance = Math.random() * varianceRange - varianceRange / 2;
  sfx.volume = 0.4 + variance;
  sfx.playbackRate = 1 + variance;
  sfx.play();
}

export default playSound;
