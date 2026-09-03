import { BackButton } from "@/components/back-button";
import { BouncyButton } from "@/components/bouncy-button";
import { Fonts, ScreenBackgrounds } from "@/constants/theme";
import { animals } from "@/data/animals";
import { useQuizSound } from "@/hooks/use-quiz-sound";
import { shuffle } from "@/lib/shuffle";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

const PAIRS = 6;

type Card = { key: string; animalId: string; image: number; flipped: boolean; matched: boolean };

function buildCards(): Card[] {
  const chosen = shuffle(animals).slice(0, PAIRS);
  const cards = chosen.flatMap((a) => [
    { key: `${a.id}-a`, animalId: a.id, image: a.adultImage, flipped: false, matched: false },
    { key: `${a.id}-b`, animalId: a.id, image: a.adultImage, flipped: false, matched: false },
  ]);
  return shuffle(cards);
}

export default function Memory() {
  const [cards, setCards] = useState<Card[]>(buildCards);
  const [flippedKeys, setFlippedKeys] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("Encontre os pares!");

  const { playPrompt, playSuccess, playError } = useQuizSound();
  const router = useRouter();

  const matchedCount = cards.filter((c) => c.matched).length / 2;

  function handleFlip(card: Card) {
    if (busy || card.flipped || card.matched) return;

    const nextFlipped = [...flippedKeys, card.key];
    setCards((cs) => cs.map((c) => (c.key === card.key ? { ...c, flipped: true } : c)));
    setFlippedKeys(nextFlipped);

    if (nextFlipped.length < 2) return;

    setBusy(true);
    const [firstKey, secondKey] = nextFlipped;
    const first = cards.find((c) => c.key === firstKey)!;

    if (first.animalId === card.animalId) {
      const animal = animals.find((a) => a.id === card.animalId)!;
      if (animal.sound) {
        playPrompt(animal.sound);
      } else {
        playSuccess();
      }

      setTimeout(() => {
        setCards((cs) =>
          cs.map((c) =>
            c.key === firstKey || c.key === secondKey ? { ...c, matched: true } : c,
          ),
        );
        setFlippedKeys([]);
        setBusy(false);

        if (matchedCount + 1 === PAIRS) {
          setMessage("🏆 Você encontrou todos!");
          setTimeout(() => router.push("/"), 1400);
        }
      }, 500);
    } else {
      playError();
      setMessage("🙂 Tente de novo!");

      setTimeout(() => {
        setCards((cs) =>
          cs.map((c) =>
            c.key === firstKey || c.key === secondKey ? { ...c, flipped: false } : c,
          ),
        );
        setFlippedKeys([]);
        setBusy(false);
        setMessage("Encontre os pares!");
      }, 900);
    }
  }

  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.title}>🧠 Jogo da Memória</Text>
      <Text style={styles.subtitle}>
        {message} ({matchedCount}/{PAIRS})
      </Text>

      <View style={styles.grid}>
        {cards.map((card) => (
          <BouncyButton
            key={card.key}
            style={[
              styles.card,
              { backgroundColor: card.matched ? "#00C853" : "#74B9FF" },
            ]}
            onPress={() => handleFlip(card)}
          >
            {card.flipped || card.matched ? (
              <Image source={card.image} style={styles.cardImage} />
            ) : (
              <Text style={styles.questionMark}>❓</Text>
            )}
          </BouncyButton>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: ScreenBackgrounds.memory,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 16,
  },
  title: {
    fontSize: 24,
    fontFamily: Fonts.rounded,
    fontWeight: "600",
    color: "#2D3436",
  },
  subtitle: { fontSize: 16, marginTop: 6, marginBottom: 20, color: "#636E72" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
  },
  card: {
    width: 100,
    height: 100,
    margin: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
  },
  questionMark: { fontSize: 44, color: "#fff" },
});
