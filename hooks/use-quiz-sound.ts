import { useAudioPlayer, type AudioSource } from "expo-audio";

const SUCCESS_SOUND = require("../assets/songs/success.mp3");
const ERROR_SOUND = require("../assets/songs/error.mp3");

// useAudioPlayer manages load/cleanup automatically; replace()+play() are
// synchronous, so there's no async gap where overlapping calls could race
// (unlike the old expo-av createAsync-based version).
export function useQuizSound() {
  const promptPlayer = useAudioPlayer(null);
  const successPlayer = useAudioPlayer(SUCCESS_SOUND);
  const errorPlayer = useAudioPlayer(ERROR_SOUND);

  function playPrompt(file: AudioSource) {
    promptPlayer.pause();
    promptPlayer.replace(file);
    promptPlayer.play();
  }

  async function playSuccess() {
    successPlayer.pause();
    await successPlayer.seekTo(0);
    successPlayer.play();
  }

  async function playError() {
    errorPlayer.pause();
    await errorPlayer.seekTo(0);
    errorPlayer.play();
  }

  return { playPrompt, playSuccess, playError };
}
