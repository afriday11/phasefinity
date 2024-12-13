import cardDrawSound1 from "/dealcard1.mp3";
import cardDrawSound2 from "/dealcard2.mp3";

const audioContext = new AudioContext();
const soundBuffers: AudioBuffer[] = [];

// Load and decode audio files
async function loadSounds() {
  const sounds = [cardDrawSound1, cardDrawSound2];

  for (const soundUrl of sounds) {
    const response = await fetch(soundUrl);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);
    soundBuffers.push(audioBuffer);
  }
}

// Initialize sounds
loadSounds();

function playSound() {
  // Create buffer source
  const source = audioContext.createBufferSource();
  const gainNode = audioContext.createGain();

  // Get random sound from our decoded buffers
  const randomBuffer =
    soundBuffers[Math.floor(Math.random() * soundBuffers.length)];
  source.buffer = randomBuffer;

  // Optional: Add variance to playback
  const varianceRange = 0.25;
  const variance = Math.random() * varianceRange - varianceRange / 2;
  source.playbackRate.value = 1 + variance;
  gainNode.gain.value = 0.4 + variance;

  // Connect nodes and play
  source.connect(gainNode);
  gainNode.connect(audioContext.destination);
  source.start();
}

export default playSound;
