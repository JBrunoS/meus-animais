import { EmojiChoiceGame } from "@/components/emoji-choice-game";
import { ScreenBackgrounds } from "@/constants/theme";
import { useGameStore } from "./store/gameStore";

export default function Food() {
  const resetProgress = useGameStore((s) => s.resetProgress);

  return (
    <EmojiChoiceGame
      title="O que esse animal come?"
      getAnswer={(a) => a.food}
      background={ScreenBackgrounds.food}
      onFinish={resetProgress}
    />
  );
}
