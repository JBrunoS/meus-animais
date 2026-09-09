import { Fonts } from "@/constants/theme";
import { animals, type Animal } from "@/data/animals";
import { useQuizSound } from "@/hooks/use-quiz-sound";
import { shuffle } from "@/lib/shuffle";
import { useState, type ReactNode } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { BackButton } from "./back-button";
import { BouncyButton } from "./bouncy-button";
import { EndScreen } from "./end-screen";
import { ProgressBar } from "./progress-bar";

const TOTAL_PHASES = 10;

export function EmojiChoiceGame({
  title,
  getAnswer,
  getLabel,
  background,
  onFinish,
  decoration,
  textColor = "#2D3436",
  backButtonColor,
  excludeGroup,
}: {
  title: string;
  getAnswer: (animal: Animal) => number;
  getLabel?: (animal: Animal) => string;
  background: string;
  onFinish?: () => void;
  decoration?: ReactNode;
  textColor?: string;
  backButtonColor?: string;
  // returns true when `other`'s food shouldn't be used as a wrong option for `current`
  // (e.g. images that look near-identical, not actual dietary overlap)
  excludeGroup?: (current: Animal, other: Animal) => boolean;
}) {
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [answering, setAnswering] = useState(false);
  const [finished, setFinished] = useState(false);

  const { playSuccess, playError } = useQuizSound();

  const [phases, setPhases] = useState<Animal[]>(() => shuffle(animals).slice(0, TOTAL_PHASES));
  const current = phases[index];
  const totalPhases = phases.length;

  const labelByValue = new Map<number, string>();
  if (getLabel) {
    for (const a of animals) {
      const value = getAnswer(a);
      if (!labelByValue.has(value)) labelByValue.set(value, getLabel(a));
    }
  }

  function generateOptions(animal: Animal) {
    const correctAnswer = getAnswer(animal);
    const wrongAnimals = animals.filter((a) => {
      if (a.id === animal.id) return false;
      if (getAnswer(a) === correctAnswer) return false;
      if (excludeGroup?.(animal, a)) return false;
      return true;
    });
    const wrongValues = [...new Set(wrongAnimals.map(getAnswer))];
    const wrongAnswers = shuffle(wrongValues).slice(0, 2);
    return shuffle([correctAnswer, ...wrongAnswers]);
  }

  const [options, setOptions] = useState<number[]>(() => generateOptions(current));

  function restart() {
    const nextPhases = shuffle(animals).slice(0, TOTAL_PHASES);
    setPhases(nextPhases);
    setIndex(0);
    setOptions(generateOptions(nextPhases[0]));
    setMessage("");
    setSelected(null);
    setAnswering(false);
    setFinished(false);
  }

  async function handleAnswer(option: number) {
    if (answering) return;
    setAnswering(true);
    setSelected(option);

    if (option === getAnswer(current)) {
      setMessage("🎉 Muito bem!");
      await playSuccess();

      setTimeout(() => {
        setSelected(null);

        if (index + 1 < phases.length) {
          const next = index + 1;
          setIndex(next);
          setOptions(generateOptions(phases[next]));
          setMessage("");
          setAnswering(false);
        } else {
          onFinish?.();
          setFinished(true);
        }
      }, 1200);
    } else {
      setMessage("🙂 Tente novamente!");
      await playError();
      setTimeout(() => {
        setSelected(null);
        setAnswering(false);
      }, 800);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      {decoration}
      <BackButton color={backButtonColor} />
      <Image source={current.adultImage} style={styles.animalImage} />
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>

      <View style={styles.options}>
        {options.map((opt) => {
          const isSelected = selected === opt;
          const isRight = opt === getAnswer(current);

          let borderColor = "transparent";
          if (isSelected) borderColor = isRight ? "#00C853" : "#D63031";

          const label = labelByValue.get(opt);

          return (
            <View key={opt} style={styles.optionWrap}>
              <BouncyButton
                style={[styles.option, { borderColor }]}
                disabled={answering}
                onPress={() => handleAnswer(opt)}
              >
                <Image source={opt} style={styles.optionImage} />
                {isSelected && (
                  <Text style={styles.mark}>{isRight ? "✓" : "✗"}</Text>
                )}
              </BouncyButton>
              {label && (
                <Text style={[styles.optionLabel, { color: textColor }]}>{label}</Text>
              )}
            </View>
          );
        })}
      </View>

      <ProgressBar current={index} total={totalPhases} />

      <Text style={[styles.message, { color: textColor }]}>{message}</Text>

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
  animalImage: {
    width: 350,
    height: 300,
    borderRadius: 24,
    marginBottom: 20,
    resizeMode: "cover",
  },
  title: {
    fontSize: 22,
    marginBottom: 40,
    textAlign: "center",
    fontFamily: Fonts.rounded,
    fontWeight: "600",
    color: "#2D3436",
  },
  options: { flexDirection: "row", gap: 20 },
  optionWrap: { alignItems: "center" },
  optionLabel: {
    marginTop: 6,
    fontSize: 14,
    fontFamily: Fonts.rounded,
    fontWeight: "600",
    textAlign: "center",
    backgroundColor: '#FFFFFF',
    width: '100%',
    borderWidth: 4,
    borderColor: '#c3c3c3',
    borderRadius: 20,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  option: {
    padding: 4,
    borderRadius: 20,
    borderWidth: 4,
    alignItems: "center",
    backgroundColor: "#FFF",
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  optionImage: {
    width: 100,
    height: 100,
    borderRadius: 16,
    resizeMode: "cover",
  },
  mark: { fontSize: 18, fontWeight: "bold", marginTop: 4 },
  message: { marginTop: 30, fontSize: 18, fontFamily: Fonts.rounded },
});
