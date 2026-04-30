import { animals } from '@/data/animals';
import { Audio } from 'expo-av';
import { useEffect, useRef } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { useGameStore } from './store/gameStore';


export default function Album() {
    // 🧠 estado global
    const unlocked = useGameStore((s) => s.unlocked);
    const soundRef = useRef(null);


    // 🔊 tocar som do animal
    async function playSound(soundFile) {
        try {
            // ⛔ para o anterior se existir
            if (soundRef.current) {
                await soundRef.current.stopAsync();
                await soundRef.current.unloadAsync();
                soundRef.current = null;
            }

            // 🔊 cria novo som
            const { sound } = await Audio.Sound.createAsync(soundFile);
            soundRef.current = sound;

            await sound.playAsync();
        } catch (e) {
            console.log('Erro ao tocar som:', e);
        }
    }

    useEffect(() => {
        return () => {
            if (soundRef.current) {
                soundRef.current.unloadAsync();
            }
        };
    }, []);

    return (
        <View style={styles.container}>
            <Text style={styles.title}>📘 Meu Álbum</Text>

            <Text style={styles.subtitle}>
                Desbloqueados: {unlocked.length} / {animals.length}
            </Text>

            <View style={styles.grid}>
                {animals.map((a) => {
                    const isUnlocked = unlocked.includes(a.id);

                    return (
                        <TouchableOpacity
                            key={a.id}
                            style={[
                                styles.card,
                                { opacity: isUnlocked ? 1 : 0.3 },
                            ]}
                            onPress={() => {
                                if (isUnlocked) playSound(a.sound);
                            }}
                        >
                            <Text style={styles.emoji}>
                                {isUnlocked ? a.emoji : '🔒'}
                            </Text>
                        </TouchableOpacity>
                    );
                })}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        alignItems: 'center',
        backgroundColor: '#fff',
    },

    title: {
        fontSize: 26,
        marginBottom: 10,
    },

    subtitle: {
        fontSize: 16,
        marginBottom: 20,
        color: '#636E72',
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '85%',
        justifyContent: 'center',
    },

    card: {
        width: 80,
        height: 80,
        margin: 10,
        backgroundColor: '#74B9FF',
        borderRadius: 15,
        justifyContent: 'center',
        alignItems: 'center',
    },

    emoji: {
        fontSize: 40,
    },
});