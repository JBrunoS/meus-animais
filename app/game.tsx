import { BackButton } from "@/components/back-button";
import { BouncyButton } from "@/components/bouncy-button";
import { ProgressBar } from "@/components/progress-bar";
import { animals, type Animal } from "@/data/animals";
import { Fonts, ScreenBackgrounds } from "@/constants/theme";
import { useQuizSound } from "@/hooks/use-quiz-sound";
import { shuffle } from "@/lib/shuffle";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useGameStore } from "./store/gameStore";

type SoundAnimal = Animal & { sound: number };
type Phase = { correct: SoundAnimal; options: SoundAnimal[] };

const soundAnimals = animals.filter((a): a is SoundAnimal => a.sound !== undefined);

export default function Game() {
  const TOTAL_PHASES = 10;

  const [message, setMessage] = useState("Quem faz esse som?");
  const [showSuccess, setShowSuccess] = useState(false);
  const [phase, setPhase] = useState<Phase | null>(null);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);

  const router = useRouter();
  const { playPrompt, playSuccess, playError } = useQuizSound();

  const phaseNumber = useGameStore((s) => s.phaseNumber);
  const nextPhase = useGameStore((s) => s.nextPhase);
  const addUnlocked = useGameStore((s) => s.addUnlocked);
  const resetProgress = useGameStore((s) => s.resetProgress);

  const [phaseSequence] = useState(() => shuffle(soundAnimals));

  function generatePhase(correctAnimal: SoundAnimal): Phase {
    const wrongOptions = shuffle(
      soundAnimals.filter((a) => a.id !== correctAnimal.id),
    ).slice(0, 2);

    return {
      correct: correctAnimal,
      options: shuffle([...wrongOptions, correctAnimal]),
    };
  }

  async function handleAnswer(animalId: string) {
    setSelected(animalId);

    const correct = animalId === phase!.correct.id;
    setIsCorrect(correct);

    if (correct) {
      setMessage("🎉 Isso!");
      addUnlocked(phase!.correct.id);
      await playSuccess();
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setSelected(null);
        setIsCorrect(null);

        if (phaseNumber + 1 < TOTAL_PHASES) {
          nextPhase();
          setPhase(generatePhase(phaseSequence[phaseNumber + 1]));
          setMessage("Quem faz esse som?");
        } else {
          setMessage("🏆 Você completou!");

          setTimeout(() => {
            resetProgress();
            router.push("/");
          }, 1200);
        }
      }, 1500);
    } else {
      setMessage("🙂 Tente novamente!");
      await playError();

      setTimeout(() => {
        setSelected(null);
        setIsCorrect(null);
      }, 800);
    }
  }

  useEffect(() => {
    setPhase(generatePhase(phaseSequence[0]));
  }, []);

  useEffect(() => {
    if (phase) {
      playPrompt(phase.correct.sound);
    }
  }, [phase]);

  if (!phase) return null;

  return (
    <View style={[styles.container, { backgroundColor: ScreenBackgrounds.game }]}>
      <BackButton />
      <Text style={styles.title}>{message}</Text>

      <BouncyButton
        style={styles.soundButton}
        onPress={() => playPrompt(phase.correct.sound)}
      >
        <Text style={styles.soundText}>🔊</Text>
      </BouncyButton>

      <View style={styles.options}>
        {phase.options.map((a) => {
          const isSelected = selected === a.id;

          let borderColor = "#74b9ff";
          if (isSelected) {
            borderColor = isCorrect ? "#00C853" : "#D63031";
          }

          return (
            <BouncyButton
              key={a.id}
              style={[styles.option, { borderColor }]}
              onPress={() => handleAnswer(a.id)}
            >
              <Image source={a.adultImage} style={styles.optionImage} />
              {isSelected && (
                <Text style={styles.mark}>{isCorrect ? "✓" : "✗"}</Text>
              )}
            </BouncyButton>
          );
        })}
      </View>

      <ProgressBar current={phaseNumber} total={TOTAL_PHASES} />

      {showSuccess && (
        <View style={styles.successOverlay}>
          <Text style={styles.successText}>🎉</Text>
        </View>
      )}

      <View style={styles.sand} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  title: {
    fontSize: 24,
    marginBottom: 20,
    fontFamily: Fonts.rounded,
    fontWeight: "600",
    color: "#2D3436",
  },

  soundButton: {
    backgroundColor: "#00B894",
    padding: 30,
    borderRadius: 100,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 5,
  },
  soundText: {
    fontSize: 40,
    color: "#fff",
  },

  options: {
    marginTop: 30,
    flexDirection: "row",
    width: "80%",
    justifyContent: "space-between",
  },
  option: {
    padding: 6,
    borderColor: "#74b9ff",
    borderWidth: 4,
    borderRadius: 20,
    alignItems: "center",
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  optionImage: {
    width: 80,
    height: 80,
    borderRadius: 14,
    resizeMode: "cover",
  },
  mark: {
    fontSize: 18,
    fontWeight: "bold",
  },

  successOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.2)",
  },
  successText: {
    fontSize: 80,
  },

  sand: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 70,
    backgroundColor: "#F5DEB3",
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
});
