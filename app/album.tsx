import { BackButton } from '@/components/back-button';
import { BouncyButton } from '@/components/bouncy-button';
import { Fonts, ScreenBackgrounds } from '@/constants/theme';
import { animals } from '@/data/animals';
import { useQuizSound } from '@/hooks/use-quiz-sound';
import { Image, StyleSheet, Text, View } from 'react-native';
import { useGameStore } from './store/gameStore';


export default function Album() {
    const unlocked = useGameStore((s) => s.unlocked);
    const { playPrompt } = useQuizSound();

    return (
        <View style={styles.container}>
            <BackButton />
            <Text style={styles.title}>📘 Meu Álbum</Text>

            <Text style={styles.subtitle}>
                Desbloqueados: {unlocked.length} / {animals.length}
            </Text>

            <View style={styles.grid}>
                {animals.map((a) => {
                    const isUnlocked = unlocked.includes(a.id);

                    return (
                        <BouncyButton
                            key={a.id}
                            style={[
                                styles.card,
                                { opacity: isUnlocked ? 1 : 0.3 },
                            ]}
                            onPress={() => {
                                if (isUnlocked && a.sound) playPrompt(a.sound);
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
            </View>
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
        borderRadius: 18,
        justifyContent: 'center',
        alignItems: 'center',
        overflow: 'hidden',
        shadowColor: '#000',
        shadowOpacity: 0.12,
        shadowRadius: 4,
        shadowOffset: { width: 0, height: 2 },
        elevation: 3,
    },

    image: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },

    lockEmoji: {
        fontSize: 40,
    },
});
