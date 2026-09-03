import { EmojiChoiceGame } from "@/components/emoji-choice-game";
import { ScreenBackgrounds } from "@/constants/theme";
import { useGameStore } from "./store/gameStore";

export default function Habitat() {
  const resetProgress = useGameStore((s) => s.resetProgress);

  return (
    <EmojiChoiceGame
      title="Onde esse animal mora?"
      getAnswer={(a) => a.habitat}
      background={ScreenBackgrounds.habitat}
      onFinish={resetProgress}
    />
  );
}
