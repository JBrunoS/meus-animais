import { AnimalGuessGame } from "@/components/animal-guess-game";
import { ScreenBackgrounds } from "@/constants/theme";
import { Image, StyleSheet, View } from "react-native";
import { useGameStore } from "./store/gameStore";

export default function Silhouette() {
  const resetProgress = useGameStore((s) => s.resetProgress);

  return (
    <AnimalGuessGame
      title="🌑 Quem está escondido?"
      background={ScreenBackgrounds.silhouette}
      onFinish={resetProgress}
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
    width: 130,
    height: 130,
    resizeMode: "contain",
    tintColor: "#2D3436",
  },
});
