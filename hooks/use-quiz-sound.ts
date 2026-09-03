import { Audio, type AVPlaybackSource } from "expo-av";
import { useEffect, useRef } from "react";

const SUCCESS_SOUND = require("../assets/songs/success.mp3");
const ERROR_SOUND = require("../assets/songs/error.mp3");

// ponytail: preloads success/error once so feedback sounds play instantly;
// the prompt sound (per-animal) still loads on demand since it changes every phase.
export function useQuizSound() {
  const currentRef = useRef<Audio.Sound | null>(null);
  const successRef = useRef<Audio.Sound | null>(null);
  const errorRef = useRef<Audio.Sound | null>(null);
  const requestId = useRef(0);

  useEffect(() => {
    Audio.Sound.createAsync(SUCCESS_SOUND).then(({ sound }) => {
      successRef.current = sound;
    });
    Audio.Sound.createAsync(ERROR_SOUND).then(({ sound }) => {
      errorRef.current = sound;
    });

    return () => {
      currentRef.current?.unloadAsync();
      successRef.current?.unloadAsync();
      errorRef.current?.unloadAsync();
    };
  }, []);

  async function playPrompt(file: AVPlaybackSource) {
    // ponytail: guards against overlapping calls (e.g. React StrictMode firing
    // the same effect twice, or a fast double-tap) — only the latest request wins.
    const id = ++requestId.current;

    try {
      if (currentRef.current) {
        await currentRef.current.stopAsync();
        await currentRef.current.unloadAsync();
      }
      if (id !== requestId.current) return;

      const { sound } = await Audio.Sound.createAsync(file);
      if (id !== requestId.current) {
        await sound.unloadAsync();
        return;
      }

      currentRef.current = sound;
      await sound.playAsync();
    } catch (e) {
      console.log("Erro ao tocar som:", e);
    }
  }

  async function playSuccess() {
    await currentRef.current?.stopAsync();
    await successRef.current?.replayAsync();
  }

  async function playError() {
    await currentRef.current?.stopAsync();
    await errorRef.current?.replayAsync();
  }

  return { playPrompt, playSuccess, playError };
}
