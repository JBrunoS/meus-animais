import { BackButton } from "@/components/back-button";
import { BouncyButton } from "@/components/bouncy-button";
import { EndScreen } from "@/components/end-screen";
import { FloatingEmoji } from "@/components/floating-emoji";
import { ProgressBar } from "@/components/progress-bar";
import { Fonts, ScreenBackgrounds } from "@/constants/theme";
import { animals, type Animal } from "@/data/animals";
import { useQuizSound } from "@/hooks/use-quiz-sound";
import { shuffle } from "@/lib/shuffle";
import { useGameStore } from "@/store/gameStore";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type SoundAnimal = Animal & { sound: number };
type Phase = { correct: SoundAnimal; options: SoundAnimal[] };

const soundAnimals = animals.filter((a): a is SoundAnimal => a.sound !== undefined);

function generatePhase(correctAnimal: SoundAnimal): Phase {
  const wrongOptions = shuffle(
    soundAnimals.filter((a) => a.id !== correctAnimal.id),
  ).slice(0, 2);

  return {
    correct: correctAnimal,
    options: shuffle([...wrongOptions, correctAnimal]),
  };
}

export default function Game() {
  const TOTAL_PHASES = 10;

  const [message, setMessage] = useState("Quem faz esse som?");
  const [showSuccess, setShowSuccess] = useState(false);
  const [selected, setSelected] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [answering, setAnswering] = useState(false);
  const [finished, setFinished] = useState(false);

  const { playPrompt, playSuccess, playError } = useQuizSound();

  const phaseNumber = useGameStore((s) => s.phaseNumber);
  const nextPhase = useGameStore((s) => s.nextPhase);
  const addUnlocked = useGameStore((s) => s.addUnlocked);
  const resetProgress = useGameStore((s) => s.resetProgress);

  const [phaseSequence, setPhaseSequence] = useState(() => shuffle(soundAnimals));
  const [phase, setPhase] = useState<Phase>(() => generatePhase(phaseSequence[0]));

  function restart() {
    resetProgress();
    const nextSequence = shuffle(soundAnimals);
    setPhaseSequence(nextSequence);
    setPhase(generatePhase(nextSequence[0]));
    setMessage("Quem faz esse som?");
    setSelected(null);
    setIsCorrect(null);
    setAnswering(false);
    setFinished(false);
  }

  async function handleAnswer(animalId: string) {
    if (answering) return;
    setAnswering(true);
    setSelected(animalId);

    const correct = animalId === phase.correct.id;
    setIsCorrect(correct);

    if (correct) {
      setMessage("🎉 Isso!");
      addUnlocked(phase.correct.id);
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
          setAnswering(false);
        } else {
          setFinished(true);
        }
      }, 1500);
    } else {
      setMessage("🙂 Tente novamente!");
      await playError();

      setTimeout(() => {
        setSelected(null);
        setIsCorrect(null);
        setAnswering(false);
      }, 800);
    }
  }

  useEffect(() => {
    playPrompt(phase.correct.sound);
  }, [phase]);

  return (
    <View style={[styles.container, { backgroundColor: ScreenBackgrounds.game }]}>
      <View style={styles.sea} />
      <View style={styles.sand} />

      <FloatingEmoji emoji="☀️" style={styles.sun} axis="y" distance={6} duration={2400} size={90} />
      <FloatingEmoji emoji="☁️" style={styles.cloud1} axis="x" distance={14} duration={3600} size={120} />
      <FloatingEmoji emoji="☁️" style={styles.cloud2} axis="x" distance={10} duration={3000} size={126} />
      <FloatingEmoji emoji="🌴" style={styles.palm} axis="x" distance={0} duration={2800} size={64} />
      <FloatingEmoji emoji="🌴" style={styles.palm2} flip axis="x" distance={0} duration={2800} size={64} />
      <FloatingEmoji emoji="🌴" style={styles.palm3} flip axis="x" distance={0} duration={2800} size={64} />
      <FloatingEmoji emoji="🌊" style={styles.wave1} axis="x" distance={8} duration={2800} size={34} />
      <FloatingEmoji emoji="🌊" style={styles.wave2} axis="x" distance={8} duration={2800} size={34} />
      <FloatingEmoji emoji="🌊" style={styles.wave3} axis="x" distance={8} duration={2800} size={34} />
      <FloatingEmoji emoji="🌊" style={styles.wave4} axis="x" distance={8} duration={2800} size={34} />
      <Text style={styles.shell1}>🐚</Text>
      <Text style={styles.shell2}>⭐</Text>

      <BackButton />
      <Text style={styles.title}>{message}</Text>

      <BouncyButton
        style={styles.soundButton}
        disabled={answering}
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
              disabled={answering}
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

      {finished && <EndScreen variant="win" onPlayAgain={restart} />}
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
    width: "90%",
    justifyContent: "space-between",
  },
  option: {
    padding: 2,
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
    width: 110,
    height: 110,
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
  },

  sea: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    height: 120,
    backgroundColor: "#2faffa",
    
  },
  wave1: { position: "absolute", bottom: 80, right: 160, zIndex:1 },
  wave2: { position: "absolute", bottom: 140, right: 14, zIndex:1 },
  wave3: { position: "absolute", bottom: 80, left: 0, zIndex:1  },
  wave4: { position: "absolute", bottom: 120, left: 100, zIndex:1 },

  sun: { position: "absolute", top: 50, right: 24 },
  cloud1: { position: "absolute", top: 90, left: 16 },
  cloud2: { position: "absolute", top: 130, right: 70 },
  palm: { position: "absolute", bottom: 55, left: 4, zIndex: 2},
  palm2: { position: "absolute", bottom: 55, left: 54, zIndex: 2},
  palm3: { position: "absolute", bottom: 55, right: 4, zIndex: 2},
  shell1: { position: "absolute", bottom: 18, right: 40, fontSize: 22, zIndex: 1 },
  shell2: { position: "absolute", bottom: 26, right: 90, fontSize: 18, zIndex: 1 },
});
