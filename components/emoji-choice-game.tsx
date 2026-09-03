import { useQuizSound } from "@/hooks/use-quiz-sound";
import { shuffle } from "@/lib/shuffle";
import { animals, type Animal } from "@/data/animals";
import { Fonts } from "@/constants/theme";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { BackButton } from "./back-button";
import { BouncyButton } from "./bouncy-button";
import { ProgressBar } from "./progress-bar";

export function EmojiChoiceGame({
  title,
  getAnswer,
  background,
  onFinish,
}: {
  title: string;
  getAnswer: (animal: Animal) => number;
  background: string;
  onFinish?: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<number | null>(null);
  const [options, setOptions] = useState<number[]>([]);

  const { playSuccess, playError } = useQuizSound();
  const router = useRouter();

  const [phases] = useState(() => shuffle(animals));
  const current = phases[index];
  const totalPhases = phases.length;

  useEffect(() => {
    const correctAnswer = getAnswer(current);
    const wrongValues = [...new Set(animals.map(getAnswer))].filter(
      (v) => v !== correctAnswer,
    );
    const wrongAnswers = shuffle(wrongValues).slice(0, 2);
    setOptions(shuffle([correctAnswer, ...wrongAnswers]));
  }, [index]);

  async function handleAnswer(option: number) {
    setSelected(option);

    if (option === getAnswer(current)) {
      setMessage("🎉 Muito bem!");
      await playSuccess();

      setTimeout(() => {
        setSelected(null);

        if (index + 1 < phases.length) {
          setIndex(index + 1);
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
      <BackButton />
      <Image source={current.adultImage} style={styles.animalImage} />
      <Text style={styles.title}>{title}</Text>

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

      <Text style={styles.message}>{message}</Text>
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
    width: 150,
    height: 150,
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
    width: 80,
    height: 80,
    borderRadius: 16,
    resizeMode: "cover",
  },
  mark: { fontSize: 18, fontWeight: "bold", marginTop: 4 },
  message: { marginTop: 30, fontSize: 18, fontFamily: Fonts.rounded },
});
