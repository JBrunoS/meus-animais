import { EmojiChoiceGame } from "@/components/emoji-choice-game";
import { FloatingEmoji } from "@/components/floating-emoji";
import { ScreenBackgrounds } from "@/constants/theme";
import { useGameStore } from "@/store/gameStore";
import { StyleSheet, Text } from "react-native";

export default function Habitat() {
  const resetProgress = useGameStore((s) => s.resetProgress);

  return (
    <EmojiChoiceGame
      title="Onde esse animal mora?"
      getAnswer={(a) => a.habitat}
      getLabel={(a) => a.habitatLabel}
      background={ScreenBackgrounds.habitat}
      onFinish={resetProgress}
      decoration={
        <>
          <FloatingEmoji emoji="☁️" style={styles.cloud1} axis="x" distance={12} duration={3400} size={40} />
          <FloatingEmoji emoji="☁️" style={styles.cloud2} axis="x" distance={10} duration={3000} size={30} />
          <FloatingEmoji emoji="🦅" style={styles.eagle} axis="x" distance={300} duration={9000} size={74} />
          <Text style={styles.map}>🗺️</Text>
          <Text style={styles.compass}>🧭</Text>
        </>
      }
    />
  );
}

const styles = StyleSheet.create({
  cloud1: { position: "absolute", top: 90, left: 16 },
  cloud2: { position: "absolute", top: 130, right: 70 },
  eagle: { position: "absolute", top: 170, left: 60, right: 60 },
  map: { position: "absolute", bottom: -90, left: -80, fontSize: 380,  },
  compass: { position: "absolute", bottom: -80, right: -60, fontSize: 234, transform: [{scaleX: -1}] },
});
