import { EmojiChoiceGame } from "@/components/emoji-choice-game";
import { FloatingEmoji } from "@/components/floating-emoji";
import { ScreenBackgrounds } from "@/constants/theme";
import { useGameStore } from "@/store/gameStore";
import { StyleSheet, Text } from "react-native";

export default function Pops() {
  const resetProgress = useGameStore((s) => s.resetProgress);

  return (
    <EmojiChoiceGame
      title="Quem é o filhote desse animal?"
      getAnswer={(a) => a.babyImage}
      background={ScreenBackgrounds.pops}
      textColor="#FFF3D6"
      onFinish={resetProgress}
      decoration={
        <>
          <FloatingEmoji emoji="🌙" style={styles.moon} axis="y" distance={0} duration={2600} size={104} />
          <FloatingEmoji emoji="✨" style={styles.firefly1} axis="x" distance={230} duration={5000} size={20} />
          <FloatingEmoji emoji="✨" style={styles.firefly2} axis="y" distance={2} duration={1800} size={16} />
          <Text style={styles.star1}>⭐</Text>
          <Text style={styles.star2}>⭐</Text>
          <Text style={styles.star3}>⭐</Text>
          <Text style={styles.nest}>🪺</Text>
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  moon: { position: "absolute", top: 50, right: 30 },
  firefly1: { position: "absolute", top: 160, left: 40 },
  firefly2: { position: "absolute", top: 220, right: 60 },
  star1: { position: "absolute", top: 70, left: 30, fontSize: 16 },
  star2: { position: "absolute", top: 140, right: 100, fontSize: 12 },
  star3: { position: "absolute", top: 100, left: 120, fontSize: 14 },
  nest: { position: "absolute", bottom: -56, right: -44, fontSize: 200 },
});
