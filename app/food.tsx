import { EmojiChoiceGame } from "@/components/emoji-choice-game";
import { FloatingEmoji } from "@/components/floating-emoji";
import { ScreenBackgrounds } from "@/constants/theme";
import { useGameStore } from "@/store/gameStore";
import { StyleSheet, Text, View } from "react-native";

export default function Food() {
  const resetProgress = useGameStore((s) => s.resetProgress);

  return (
    <EmojiChoiceGame
      title="O que esse animal come?"
      getAnswer={(a) => a.food}
      background={ScreenBackgrounds.food}
      onFinish={resetProgress}
      decoration={
        <>
          <View style={styles.grass} />
          <FloatingEmoji emoji="☀️" style={styles.sun} axis="y" distance={0} duration={2400} size={100} />
          <FloatingEmoji emoji="☁️" style={styles.cloud1} axis="x" distance={12} duration={3400} size={120} />
          <FloatingEmoji emoji="☁️" style={styles.cloud2} axis="x" distance={10} duration={3000} size={70} />
          <FloatingEmoji emoji="🦋" style={styles.butterfly} axis="y" distance={10} duration={1600} size={26} />
          <FloatingEmoji emoji="🌾" style={styles.hay1} axis="x" distance={0} duration={2200} size={40} />
          <FloatingEmoji emoji="🌾" style={styles.hay2} axis="x" distance={0} duration={2600} size={34} />
          <FloatingEmoji emoji="🌾" style={styles.hay3} flip axis="x" distance={0} duration={2600} size={34} />
          <Text style={styles.barn}>🏡</Text>
          <Text style={styles.basket}>🧺</Text>
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  grass: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#9CCC65",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
  sun: { position: "absolute", top: 50, right: 24 },
  cloud1: { position: "absolute", top: 90, left: 16 },
  cloud2: { position: "absolute", top: 130, right: 70 },
  butterfly: { position: "absolute", top: 160, left: 40 },
  hay1: { position: "absolute", bottom: 20, left: 12, zIndex: 1 },
  hay2: { position: "absolute", bottom: 14, right: 90, zIndex: 1 },
  hay3: { position: "absolute", bottom: 14, right: 105, zIndex: 1 },
  barn: { position: "absolute", bottom: 18, right: 16, fontSize: 256 },
  basket: { position: "absolute", bottom: 42, right: 40, fontSize: 50 },
});
