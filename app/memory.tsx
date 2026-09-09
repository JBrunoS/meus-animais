import { BackButton } from "@/components/back-button";
import { BouncyButton } from "@/components/bouncy-button";
import { EndScreen } from "@/components/end-screen";
import { Fonts, ScreenBackgrounds } from "@/constants/theme";
import { animals } from "@/data/animals";
import { useQuizSound } from "@/hooks/use-quiz-sound";
import { shuffle } from "@/lib/shuffle";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, useWindowDimensions, View } from "react-native";

const PHASES = [
  { pairs: 4, seconds: 45 },
  { pairs: 6, seconds: 60 },
  { pairs: 8, seconds: 75 },
  { pairs: 10, seconds: 90 },
  { pairs: 12, seconds: 105 },
  { pairs: 14, seconds: 120 },
  { pairs: 16, seconds: 135 },
  { pairs: 18, seconds: 150 },
];

const GRID_CARD_MARGIN = 8;
type Mode = "easy" | "hard";

// ponytail: picks the column count that matches the grid's aspect ratio to
// the available width/height box (classic sqrt(N * W/H) grid formula),
// then sizes cards to that. Maximizing card size alone always favored more
// columns/fewer rows on a tall phone screen and left height unused.
function useCardSize(totalCards: number) {
  const { width, height } = useWindowDimensions();
  const gridWidth = width * 0.9;
  const gridHeight = height * 0.6;

  const columns = Math.max(1, Math.round(Math.sqrt(totalCards * (gridWidth / gridHeight))));
  const rows = Math.ceil(totalCards / columns);
  const sizeByWidth = gridWidth / columns - GRID_CARD_MARGIN * 2;
  const sizeByHeight = gridHeight / rows - GRID_CARD_MARGIN * 2;

  return Math.max(36, Math.min(sizeByWidth, sizeByHeight));
}

type Card = { key: string; animalId: string; image: number; flipped: boolean; matched: boolean };
type GameState = { phaseIndex: number; cards: Card[]; timeLeft: number };

function buildCards(pairs: number): Card[] {
  const chosen = shuffle(animals).slice(0, pairs);
  const cards = chosen.flatMap((a) => [
    { key: `${a.id}-a`, animalId: a.id, image: a.adultImage, flipped: false, matched: false },
    { key: `${a.id}-b`, animalId: a.id, image: a.adultImage, flipped: false, matched: false },
  ]);
  return shuffle(cards);
}

function startPhase(phaseIndex: number): GameState {
  return {
    phaseIndex,
    cards: buildCards(PHASES[phaseIndex].pairs),
    timeLeft: PHASES[phaseIndex].seconds,
  };
}

function ModeSelect({ onSelect }: { onSelect: (mode: Mode) => void }) {
  return (
    <View style={styles.container}>
      <BackButton />
      <Text style={styles.sparkle1}>✨</Text>
      <Text style={styles.sparkle2}>⭐</Text>
      <Text style={styles.title}>🧠 Jogo da Memória</Text>
      <Text style={styles.subtitle}>Escolha o modo de jogo</Text>

      <BouncyButton style={[styles.modeButton, styles.easyButton]} onPress={() => onSelect("easy")}>
        <Text style={styles.modeEmoji}>🎯</Text>
        <Text style={styles.modeText}>Fácil</Text>
        <Text style={styles.modeSubtext}>Sem cronômetro</Text>
      </BouncyButton>

      <BouncyButton style={[styles.modeButton, styles.hardButton]} onPress={() => onSelect("hard")}>
        <Text style={styles.modeEmoji}>⏱️</Text>
        <Text style={styles.modeText}>Difícil</Text>
        <Text style={styles.modeSubtext}>Com cronômetro</Text>
      </BouncyButton>
    </View>
  );
}

export default function Memory() {
  const [mode, setMode] = useState<Mode | null>(null);
  const [game, setGame] = useState<GameState>(() => startPhase(0));
  const [flippedKeys, setFlippedKeys] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("Encontre os pares!");
  const [finished, setFinished] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const { playPrompt, playSuccess, playError } = useQuizSound();

  const phase = PHASES[game.phaseIndex];
  const matchedCount = game.cards.filter((c) => c.matched).length / 2;
  const cardSize = useCardSize(phase.pairs * 2);
  const timeUp = mode === "hard" && game.timeLeft === 0;

  useEffect(() => {
    if (mode !== "hard") return;
    const id = setInterval(() => {
      setGame((g) => ({ ...g, timeLeft: Math.max(0, g.timeLeft - 1) }));
    }, 1000);
    return () => clearInterval(id);
  }, [game.phaseIndex, mode]);

  useEffect(() => {
    if (!timeUp) return;
    const id = setTimeout(() => setGameOver(true), 1200);
    return () => clearTimeout(id);
  }, [timeUp]);

  const displayMessage = timeUp ? "⏰ Tempo esgotado!" : message;

  function restart() {
    setGame(startPhase(0));
    setFlippedKeys([]);
    setBusy(false);
    setMessage("Encontre os pares!");
    setFinished(false);
    setGameOver(false);
  }

  function handleFlip(card: Card) {
    if (busy || card.flipped || card.matched || timeUp) return;

    const nextFlipped = [...flippedKeys, card.key];
    setGame((g) => ({
      ...g,
      cards: g.cards.map((c) => (c.key === card.key ? { ...c, flipped: true } : c)),
    }));
    setFlippedKeys(nextFlipped);

    if (nextFlipped.length < 2) return;

    setBusy(true);
    const [firstKey, secondKey] = nextFlipped;
    const first = game.cards.find((c) => c.key === firstKey)!;

    if (first.animalId === card.animalId) {
      const animal = animals.find((a) => a.id === card.animalId)!;
      if (animal.sound) {
        playPrompt(animal.sound);
      } else {
        playSuccess();
      }

      setTimeout(() => {
        setGame((g) => ({
          ...g,
          cards: g.cards.map((c) =>
            c.key === firstKey || c.key === secondKey ? { ...c, matched: true } : c,
          ),
        }));
        setFlippedKeys([]);
        setBusy(false);

        if (matchedCount + 1 === phase.pairs) {
          if (game.phaseIndex + 1 < PHASES.length) {
            setMessage("🎉 Fase completa!");
            setTimeout(() => setGame(startPhase(game.phaseIndex + 1)), 1200);
          } else {
            setMessage("🏆 Você completou tudo!");
            setTimeout(() => setFinished(true), 1200);
          }
        }
      }, 500);
    } else {
      playError();
      setMessage("🙂 Tente de novo!");

      setTimeout(() => {
        setGame((g) => ({
          ...g,
          cards: g.cards.map((c) =>
            c.key === firstKey || c.key === secondKey ? { ...c, flipped: false } : c,
          ),
        }));
        setFlippedKeys([]);
        setBusy(false);
        setMessage("Encontre os pares!");
      }, 900);
    }
  }

  if (mode === null) {
    return <ModeSelect onSelect={setMode} />;
  }

  return (
    <View style={styles.container}>
      <Text style={styles.sparkle1}>✨</Text>
      <Text style={styles.sparkle2}>⭐</Text>
      <Text style={styles.sparkle3}>✨</Text>

      <BackButton />
      <Text style={styles.title}>🧠 Jogo da Memória</Text>
      <Text style={styles.subtitle}>
        Fase {game.phaseIndex + 1}/{PHASES.length} · {matchedCount}/{phase.pairs} pares
      </Text>
      {mode === "hard" && (
        <Text style={[styles.timer, game.timeLeft <= 10 && styles.timerLow]}>
          ⏱️ {game.timeLeft}s
        </Text>
      )}
      <Text style={styles.message}>{displayMessage}</Text>

      <View style={styles.grid}>
        {game.cards.map((card) => (
          <BouncyButton
            key={card.key}
            style={[
              styles.card,
              {
                width: cardSize,
                height: cardSize,
                backgroundColor: card.matched ? "#00C853" : "#74B9FF",
              },
            ]}
            onPress={() => handleFlip(card)}
          >
            {card.flipped || card.matched ? (
              <Image source={card.image} style={styles.cardImage} />
            ) : (
              <Text style={[styles.questionMark, { fontSize: cardSize * 0.44 }]}>❓</Text>
            )}
          </BouncyButton>
        ))}
      </View>

      {finished && <EndScreen variant="win" onPlayAgain={restart} />}
      {gameOver && <EndScreen variant="lose" onPlayAgain={restart} />}
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
  subtitle: { fontSize: 15, marginTop: 6, color: "#636E72" },
  timer: {
    fontSize: 20,
    fontFamily: Fonts.rounded,
    fontWeight: "700",
    color: "#2D3436",
    marginTop: 4,
  },
  timerLow: { color: "#D63031" },
  message: { fontSize: 16, marginTop: 6, marginBottom: 16, color: "#636E72" },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    width: "100%",
  },
  card: {
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
  questionMark: { color: "#fff" },

  sparkle1: { position: "absolute", top: 60, left: 24, fontSize: 20 },
  sparkle2: { position: "absolute", top: 90, right: 30, fontSize: 16 },
  sparkle3: { position: "absolute", top: 140, left: 40, fontSize: 14 },

  modeButton: {
    width: 220,
    paddingVertical: 20,
    borderRadius: 24,
    alignItems: "center",
    marginTop: 20,
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  easyButton: { backgroundColor: "#00B894" },
  hardButton: { backgroundColor: "#D63031" },
  modeEmoji: { fontSize: 36 },
  modeText: {
    fontSize: 20,
    fontFamily: Fonts.rounded,
    fontWeight: "700",
    color: "#fff",
    marginTop: 4,
  },
  modeSubtext: { fontSize: 14, color: "#fff", marginTop: 2 },
});
