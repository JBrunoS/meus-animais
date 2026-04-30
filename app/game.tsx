import { animals } from '@/data/animals';
import { Audio } from 'expo-av';
import { useRouter } from 'expo-router';
import { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGameStore } from './store/gameStore';

export default function Game() {
  const TOTAL_PHASES = 10;

  const [message, setMessage] = useState('Quem faz esse som?');
  const [sound, setSound] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [phase, setPhase] = useState(null);
  const [selected, setSelected] = useState(null);
  const [isCorrect, setIsCorrect] = useState(null);

  const router = useRouter();

  // 🧠 STORE
  const phaseNumber = useGameStore((s) => s.phaseNumber);
  const nextPhase = useGameStore((s) => s.nextPhase);
  const addUnlocked = useGameStore((s) => s.addUnlocked);
  const resetGame = useGameStore((s) => s.resetGame);

  const [phaseSequence] = useState(() =>
    [...animals].sort(() => Math.random() - 0.5)
  );

  function generatePhase(correctAnimal) {
    const shuffled = [...animals]
      .filter((a) => a.id !== correctAnimal.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 2);

    return {
      correct: correctAnimal,
      options: [...shuffled, correctAnimal].sort(
        () => Math.random() - 0.5
      ),
    };
  }

  async function playSound(file) {
    try {
      if (sound) {
        await sound.stopAsync();
        await sound.unloadAsync();
      }

      const { sound: newSound } = await Audio.Sound.createAsync(file);
      setSound(newSound);

      await newSound.playAsync();
    } catch (error) {
      console.log('Erro ao tocar som:', error);
    }
  }

  async function handleAnswer(animalId) {
    setSelected(animalId);

    const correct = animalId === phase.correct.id;
    setIsCorrect(correct);

    if (correct) {
      setMessage('🎉 Isso!');

      // 🧠 salva no álbum
      addUnlocked(phase.correct.id);

      if (sound) {
        await sound.stopAsync();
      }

      await playSound(require('../assets/images/success.mp3'));
      setShowSuccess(true);

      setTimeout(() => {
        setShowSuccess(false);
        setSelected(null);
        setIsCorrect(null);

        if (phaseNumber + 1 < TOTAL_PHASES) {
          nextPhase();
          setPhase(generatePhase(phaseSequence[phaseNumber + 1]));
          setMessage('Quem faz esse som?');
        } else {
          setMessage('🏆 Você completou!');

          setTimeout(() => {
            resetGame();
            router.push('/');
          }, 1200);
        }
      }, 1500);
    } else {
      setMessage('🙂 Tente novamente!');
      await playSound(require('../assets/images/error.mp3'));

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
      playSound(phase.correct.sound);
    }
  }, [phase]);

  useEffect(() => {
    return () => {
      if (sound) {
        sound.unloadAsync();
      }
    };
  }, [sound]);

  if (!phase) return null;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{message}</Text>

      <TouchableOpacity
        style={styles.soundButton}
        onPress={() => playSound(phase.correct.sound)}
      >
        <Text style={styles.soundText}>🔊</Text>
      </TouchableOpacity>

      <View style={styles.options}>
        {phase.options.map((a) => {
          const isSelected = selected === a.id;

          let backgroundColor = '#FFF';
          let borderColor = '#74b9ff';

          if (isSelected) {
            backgroundColor = isCorrect ? '#00C853' : '#D63031';
            borderColor = isCorrect ? '#00C853' : '#D63031';
          }

          return (
            <TouchableOpacity
              key={a.id}
              style={[styles.option, { backgroundColor, borderColor }]}
              onPress={() => handleAnswer(a.id)}
            >
              <Text style={styles.optionText}>{a.emoji}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

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

      {showSuccess && (
        <View style={styles.successOverlay}>
          <Text style={styles.successText}>🎉</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
    justifyContent: 'center',
    alignItems: 'center',
  },

  progressBar: {
    width: '80%',
    height: 10,
    backgroundColor: '#DDD',
    borderRadius: 10,
    overflow: 'hidden',
    marginTop: 60,
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#6C5CE7',
  },
  progressText: {
    marginTop: 20,
    fontSize: 16,
  },

  title: {
    fontSize: 24,
    marginBottom: 20,
  },

  soundButton: {
    backgroundColor: '#00B894',
    padding: 30,
    borderRadius: 100,
    marginBottom: 30,
  },
  soundText: {
    fontSize: 40,
    color: '#fff',
  },

  options: {
    marginTop: 30,
    flexDirection: 'row',
    width: '80%',
    justifyContent: 'space-between',
  },
  option: {
    padding: 15,
    borderColor: '#74b9ff',
    borderWidth: 4,
    borderRadius: 20,
  },
  optionText: {
    fontSize: 60,
  },

  successOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  successText: {
    fontSize: 80,
  },
});