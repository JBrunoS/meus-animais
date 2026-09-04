import { Fonts } from "@/constants/theme";
import { animals, type Animal } from "@/data/animals";
import { useQuizSound } from "@/hooks/use-quiz-sound";
import { shuffle } from "@/lib/shuffle";
import { useRouter } from "expo-router";
import { useState, type ReactNode } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { BackButton } from "./back-button";
import { BouncyButton } from "./bouncy-button";
import { ProgressBar } from "./progress-bar";

export function EmojiChoiceGame({
  title,
  getAnswer,
  background,
  onFinish,
  decoration,
  textColor = "#2D3436",
}: {
  title: string;
  getAnswer: (animal: Animal) => number;
  background: string;
  onFinish?: () => void;
  decoration?: ReactNode;
  textColor?: string;
}) {
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<number | null>(null);

  const { playSuccess, playError } = useQuizSound();
  const router = useRouter();

  const [phases] = useState(() => shuffle(animals));
  const current = phases[index];
  const totalPhases = phases.length;

  function generateOptions(animal: Animal) {
    const correctAnswer = getAnswer(animal);
    const wrongValues = [...new Set(animals.map(getAnswer))].filter(
      (v) => v !== correctAnswer,
    );
    const wrongAnswers = shuffle(wrongValues).slice(0, 2);
    return shuffle([correctAnswer, ...wrongAnswers]);
  }

  const [options, setOptions] = useState<number[]>(() => generateOptions(current));

  async function handleAnswer(option: number) {
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
        } else {
          setMessage("🏆 Você terminou!");
          setTimeout(() => {
            onFinish?.();
            router.push("/");
          }, 1200);
        }
      }, 1200);
    } else {
      setMessage("🙂 Tente novamente!");
      await playError();
      setTimeout(() => setSelected(null), 800);
    }
  }

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      {decoration}
      <BackButton />
      <Image source={current.adultImage} style={styles.animalImage} />
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>

      <View style={styles.options}>
        {options.map((opt) => {
          const isSelected = selected === opt;
          const isRight = opt === getAnswer(current);

          let borderColor = "transparent";
          if (isSelected) borderColor = isRight ? "#00C853" : "#D63031";

          return (
            <BouncyButton
              key={opt}
              style={[styles.option, { borderColor }]}
              onPress={() => handleAnswer(opt)}
            >
              <Image source={opt} style={styles.optionImage} />
              {isSelected && (
                <Text style={styles.mark}>{isRight ? "✓" : "✗"}</Text>
              )}
            </BouncyButton>
          );
        })}
      </View>

      <ProgressBar current={index} total={totalPhases} />

      <Text style={[styles.message, { color: textColor }]}>{message}</Text>
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
