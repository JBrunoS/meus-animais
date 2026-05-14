import { animals } from "@/data/animals";
import { Audio } from "expo-av";
import { useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { useGameStore } from "./store/gameStore";

export default function Pops() {
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState("");
  const [selected, setSelected] = useState(null);
  const [sound, setSound] = useState(null);
  const [options, setOptions] = useState([]);

  const resetProgress = useGameStore((s) => s.resetProgress);
  const router = useRouter();

  // 🔀 embaralha animais
  const [phases] = useState(() => [...animals].sort(() => Math.random() - 0.5));

  const current = phases[index];

  const TOTAL_PHASES = phases.length;
  const phaseNumber = index;

  // 🔊 som
  async function playSound(file) {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(file);
      setSound(newSound);

      await newSound.playAsync();
    } catch (e) {
      console.log("erro som", e);
    }
  }

  function shuffle(array) {
    return [...array].sort(() => Math.random() - 0.5);
  }

  // 🎯 gerar opções (filhotes aleatórios)
  function generateOptions(correctAnimal) {
    const wrongBabies = animals
      .filter((a) => a.id !== correctAnimal.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2)
      .map((a) => a.baby);

    return shuffle([correctAnimal.baby, ...wrongBabies]);
  }

  useEffect(() => {
    if (current) {
      setOptions(generateOptions(current));
    }
  }, [index]);

  async function handleAnswer(option) {
    setSelected(option);

    if (option === current.baby) {
      setMessage("🎉 Muito bem!");

      await playSound(require("../assets/images/success.mp3"));

      setTimeout(() => {
        setSelected(null);

        if (index + 1 < phases.length) {
          setIndex(index + 1);
          setMessage("");
        } else {
          setMessage("🏆 Você completou!");

          setTimeout(() => {
            resetProgress();
            router.push("/");
          }, 1200);
        }
      }, 1200);
    } else {
      setMessage("🙂 Tente novamente!");

      await playSound(require("../assets/images/error.mp3"));

      setTimeout(() => setSelected(null), 800);
    }
  }

  useEffect(() => {
    return () => {
      if (sound) sound.unloadAsync();
    };
  }, [sound]);

  return (
    <View style={styles.container}>
      <Text style={styles.parent}>{current.emoji}</Text>

      <Text style={styles.title}>Quem é o filhote desse animal?</Text>

      <View style={styles.options}>
        {options.map((opt) => {
          let bg = "#74B9FF";

          if (selected === opt) {
            bg = opt === current.baby ? "#00C853" : "#D63031";
          }

          return (
            <TouchableOpacity
              key={opt}
              style={[styles.option, { backgroundColor: bg }]}
              onPress={() => handleAnswer(opt)}
            >
              <Text style={styles.emoji}>{opt}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* 📊 PROGRESSO */}
      <View style={styles.progressBar}>
        <View
          style={[
            styles.progressFill,
            {
              width: `${((phaseNumber + 1) / TOTAL_PHASES) * 100}%`,
            },
          ]}
        />
      </View>

      <Text style={styles.progressText}>
        Fase {phaseNumber + 1} / {TOTAL_PHASES}
      </Text>

      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },

  parent: {
    fontSize: 90,
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    marginBottom: 40,
    textAlign: "center",
  },

  options: {
    flexDirection: "row",
    gap: 20,
  },

  option: {
    padding: 20,
    borderRadius: 20,
  },

  emoji: {
    fontSize: 50,
  },

  message: {
    marginTop: 30,
    fontSize: 18,
  },

  progressBar: {
    width: "80%",
    height: 10,
    backgroundColor: "#DDD",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 40,
  },

  progressFill: {
    height: "100%",
    backgroundColor: "#6C5CE7",
  },

  progressText: {
    marginTop: 10,
    fontSize: 16,
  },
});
