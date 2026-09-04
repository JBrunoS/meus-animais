import { AnimalGuessGame } from "@/components/animal-guess-game";
import { FloatingEmoji } from "@/components/floating-emoji";
import { ScreenBackgrounds } from "@/constants/theme";
import { useGameStore } from "@/store/gameStore";
import { Image, StyleSheet, Text, View } from "react-native";

export default function Silhouette() {
  const resetProgress = useGameStore((s) => s.resetProgress);

  return (
    <AnimalGuessGame
      title="🌑 Quem está escondido?"
      background={ScreenBackgrounds.silhouette}
      textColor="#FFF3D6"
      onFinish={resetProgress}
      decoration={
        <>
          <FloatingEmoji emoji="🌙" style={styles.moon} axis="y" distance={6} duration={2600} size={60} />
          <FloatingEmoji emoji="✨" style={styles.firefly1} axis="y" distance={10} duration={1500} size={20} />
          <FloatingEmoji emoji="✨" style={styles.firefly2} axis="y" distance={8} duration={1800} size={16} />
          <Text style={styles.star1}>⭐</Text>
          <Text style={styles.star2}>⭐</Text>
          <Text style={styles.star3}>⭐</Text>
        </>
      }
      renderClue={(animal) => (
        <View style={styles.shadow}>
          <Image source={animal.adultImage} style={styles.image} />
        </View>
      )}
    />
  );
}

const styles = StyleSheet.create({
  shadow: {
    width: 160,
    height: 160,
    borderRadius: 24,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  image: {
    width: 240,
    height: 240,
    resizeMode: "contain",
    tintColor: "#2D3436",
  },
  moon: { position: "absolute", top: 50, left: 30 },
  firefly1: { position: "absolute", top: 150, right: 40 },
  firefly2: { position: "absolute", top: 210, left: 50 },
  star1: { position: "absolute", top: 70, right: 30, fontSize: 16 },
  star2: { position: "absolute", top: 140, left: 100, fontSize: 12 },
  star3: { position: "absolute", top: 100, right: 120, fontSize: 14 },
});
