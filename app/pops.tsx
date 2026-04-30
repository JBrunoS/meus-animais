import { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Phase3() {
    const [index, setIndex] = useState(0);
    const [message, setMessage] = useState('');
    const [selected, setSelected] = useState(null);

    const phases = [
        {
            question: 'Quem é o filhote do cachorro?',
            correct: '🐕',
            options: ['🐕', '🐱', '🐮'],
            parent: '🐶',
        },
        {
            question: 'Quem é o filhote do gato?',
            correct: '🐈',
            options: ['🐈', '🐶', '🦁'],
            parent: '🐱',
        },
        {
            question: 'Quem é o filhote da vaca?',
            correct: '🐄',
            options: ['🐄', '🐕', '🐸'],
            parent: '🐮',
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
                    setMessage('🏆 Você completou a fase dos filhotes!');
                }
            }, 1000);
        } else {
            setMessage('🙂 Tente novamente!');
            setTimeout(() => setSelected(null), 800);
        }
    }

    return (
        <View style={styles.container}>
            <Text style={styles.parent}>{current.parent}</Text>

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
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    parent: {
        fontSize: 80,
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