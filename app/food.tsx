import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Phase1() {
  const [index, setIndex] = useState(0);
  const [message, setMessage] = useState('');
  const [selected, setSelected] = useState(null);

  const phases = [
    {
      animal: '🐰',
      question: 'O que o coelho come?',
      correct: '🥕',
      options: ['🥕', '🍗', '🐟'],
    },
    {
      animal: '🐵',
      question: 'O que o macaco come?',
      correct: '🍌',
      options: ['🍌', '🥩', '🐠'],
    },
    {
      animal: '🦁',
      question: 'O que o leão come?',
      correct: '🥩',
      options: ['🥩', '🥕', '🍎'],
    },
  ];

  const current = phases[index];

  function handleAnswer(option) {
    setSelected(option);

    if (option === current.correct) {
      setMessage('🎉 Muito bem!');

      setTimeout(() => {
        setSelected(null);

        if (index + 1 < phases.length) {
          setIndex(index + 1);
          setMessage('');
        } else {
          setMessage('🏆 Você terminou a fase da comida!');
        }
      }, 1000);
    } else {
      setMessage('🙂 Tente novamente!');
      setTimeout(() => setSelected(null), 800);
    }
  }

  return (
    <View style={styles.container}>
      <Text style={styles.animal}>{current.animal}</Text>

      <Text style={styles.title}>{current.question}</Text>

      <View style={styles.options}>
        {current.options.map((opt) => {
          let bg = '#74B9FF';

          if (selected === opt) {
            bg = opt === current.correct ? '#00C853' : '#D63031';
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

      <Text style={styles.message}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
  },

  animal: {
    fontSize: 90,
    marginBottom: 20,
  },

  title: {
    fontSize: 22,
    marginBottom: 40,
    textAlign: 'center',
  },

  options: {
    flexDirection: 'row',
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
});