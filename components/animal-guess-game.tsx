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

export function AnimalGuessGame({
  title,
  renderClue,
  background,
  onFinish,
  decoration,
  textColor = "#2D3436",
}: {
  title: string;
  renderClue: (animal: Animal) => ReactNode;
  background: string;
  onFinish?: () => void;
  decoration?: ReactNode;
  textColor?: string;
}) {
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState<string | null>(null);

  const { playSuccess, playError } = useQuizSound();
  const router = useRouter();

  const [phases] = useState(() => shuffle(animals));
  const current = phases[index];
  const totalPhases = phases.length;

  function generateOptions(animal: Animal) {
    const wrongOptions = shuffle(animals.filter((a) => a.id !== animal.id)).slice(0, 2);
    return shuffle([animal, ...wrongOptions]);
  }

  const [options, setOptions] = useState<Animal[]>(() => generateOptions(phases[0]));

  async function handleAnswer(animalId: string) {
    setSelected(animalId);

    if (animalId === current.id) {
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
      <Text style={[styles.title, { color: textColor }]}>{title}</Text>

      {renderClue(current)}

      <View style={styles.options}>
        {options.map((a) => {
          const isSelected = selected === a.id;
          const isRight = a.id === current.id;

          let borderColor = "transparent";
          if (isSelected) borderColor = isRight ? "#00C853" : "#D63031";

          return (
            <BouncyButton
              key={a.id}
              style={[styles.option, { borderColor }]}
              onPress={() => handleAnswer(a.id)}
            >
              <Image source={a.adultImage} style={styles.optionImage} />
              {isSelected && <Text style={styles.mark}>{isRight ? "✓" : "✗"}</Text>}
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
  title: {
    fontSize: 22,
    marginBottom: 20,
    textAlign: "center",
    fontFamily: Fonts.rounded,
    fontWeight: "600",
    color: "#2D3436",
  },
  options: {
    marginTop: 30,
    flexDirection: "row",
    width: "90%",
    justifyContent: "space-between",
  },
  option: {
    padding: 4,
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
    width: 100,
    height: 100,
    borderRadius: 16,
    resizeMode: "cover",
  },
  mark: { fontSize: 18, fontWeight: "bold" },
  message: { marginTop: 20, fontSize: 18, fontFamily: Fonts.rounded },
});
