import { Fonts } from "@/constants/theme";
import { useRouter } from "expo-router";
import { StyleSheet, Text, View } from "react-native";
import { BouncyButton } from "./bouncy-button";

export function EndScreen({
  variant,
  onPlayAgain,
}: {
  variant: "win" | "lose";
  onPlayAgain: () => void;
}) {
  const router = useRouter();
  const isWin = variant === "win";

  return (
    <View style={styles.overlay}>
      <Text style={styles.emoji}>{isWin ? "🏆" : "💀"}</Text>
      <Text style={styles.title}>{isWin ? "Você completou tudo!" : "Game Over"}</Text>
      {!isWin && <Text style={styles.subtitle}>O tempo acabou!</Text>}

      <BouncyButton style={[styles.button, styles.primary]} onPress={onPlayAgain}>
        <Text style={styles.buttonText}>🔄 Jogar de novo</Text>
      </BouncyButton>

      <BouncyButton style={[styles.button, styles.secondary]} onPress={() => router.replace("/")}>
        <Text style={styles.buttonText}>🏠 Tela Inicial</Text>
      </BouncyButton>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.8)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 20,
  },
  emoji: { fontSize: 80, marginBottom: 12 },
  title: {
    fontSize: 26,
    fontFamily: Fonts.rounded,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 4,
    textAlign: "center",
    paddingHorizontal: 20,
  },
  subtitle: { fontSize: 16, color: "#eee", marginBottom: 24 },
  button: {
    width: 220,
    paddingVertical: 16,
    borderRadius: 20,
    marginTop: 14,
    alignItems: "center",
  },
  primary: { backgroundColor: "#00B894" },
  secondary: { backgroundColor: "#6C5CE7" },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontFamily: Fonts.rounded,
    fontWeight: "600",
  },
});
