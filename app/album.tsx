import { BackButton } from '@/components/back-button';
import { BouncyButton } from '@/components/bouncy-button';
import { Fonts, ScreenBackgrounds } from '@/constants/theme';
import { animals } from '@/data/animals';
import { useQuizSound } from '@/hooks/use-quiz-sound';
import { useGameStore } from '@/store/gameStore';
import { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';


export default function Album() {
    const unlocked = useGameStore((s) => s.unlocked);
    const { playPrompt, isPromptPlaying } = useQuizSound();
    const [playingId, setPlayingId] = useState<string | null>(null);

    return (
        <View style={styles.container}>
            <Text style={styles.sparkle1}>✨</Text>
            <Text style={styles.sparkle2}>⭐</Text>

            <BackButton />
            <Text style={styles.title}>📘 Meu Álbum</Text>

            <Text style={styles.subtitle}>
                Desbloqueados: {unlocked.length} / {animals.length}
            </Text>

            <ScrollView
                style={styles.scrollArea}
                contentContainerStyle={styles.grid}
                showsVerticalScrollIndicator={false}
            >
                {animals.map((a) => {
                    const isUnlocked = unlocked.includes(a.id);

                    const isPlaying = isPromptPlaying && playingId === a.id;

                    return (
                        <BouncyButton
                            key={a.id}
                            style={[
                                styles.card,
                                { opacity: isUnlocked ? 1 : 0.3 },
                                isPlaying && styles.cardPlaying,
                            ]}
                            disabled={isPromptPlaying}
                            onPress={() => {
                                if (isUnlocked && a.sound && !isPromptPlaying) {
                                    setPlayingId(a.id);
                                    playPrompt(a.sound);
                                }
                            }}
                        >
                            {isUnlocked ? (
                                <Image source={a.adultImage} style={styles.image} />
                            ) : (
                                <Text style={styles.lockEmoji}>🔒</Text>
                            )}
                        </BouncyButton>
                    );
                })}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 60,
        alignItems: 'center',
        backgroundColor: ScreenBackgrounds.album,
    },

    title: {
        fontSize: 26,
        marginTop: 50,
        marginBottom: 10,
        fontFamily: Fonts.rounded,
        fontWeight: '600',
        color: '#2D3436',
    },

    subtitle: {
        fontSize: 16,
        marginBottom: 20,
        color: '#636E72',
    },

    scrollArea: {
        flex: 1,
        width: '90%',
    },

    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        paddingBottom: 24,
    },

    card: {
        width: 80,
        height: 80,
        margin: 8,
        backgroundColor: '#74B9FF',
        borderRadius: 18,
        borderWidth: 4,
        borderColor: 'transparent',
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },

    cardPlaying: {
        borderColor: '#6ffa38',
    },

    image: {
        width: '90%',
        height: '90%',
        resizeMode: 'cover',
    },

    lockEmoji: {
        fontSize: 40,
    },

    sparkle1: { position: 'absolute', top: 64, left: 24, fontSize: 18 },
    sparkle2: { position: 'absolute', top: 64, right: 24, fontSize: 16 },
});
