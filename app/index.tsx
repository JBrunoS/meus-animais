import { BouncyButton } from '@/components/bouncy-button';
import { FloatingEmoji, FloatingImage } from '@/components/floating-emoji';
import { Fonts, FunColors } from '@/constants/theme';
import { animals } from '@/data/animals';
import { shuffle } from '@/lib/shuffle';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const MENU = [
  { label: '🔊 Jogo de Sons', route: '/game' },
  { label: '🍓 Alimentando os animais', route: '/food' },
  { label: '🐣 Jogo dos filhotes', route: '/pops' },
  { label: '🏠 Onde ele mora?', route: '/habitat' },
  { label: '🧠 Jogo da Memória', route: '/memory' },
  { label: '🌑 Adivinhe a Silhueta', route: '/silhouette' },
  { label: '📘 Meu Álbum', route: '/album' },
] as const;

const FEATURED_POOL = animals.filter((a) => a.faceImage);

export default function Home() {
  const router = useRouter();
  const [featured] = useState(() => shuffle(FEATURED_POOL).slice(0, 3));

  return (
    <View style={styles.container}>
      <FloatingEmoji emoji="☀️" style={styles.sun} axis="y" distance={6} duration={2400} size={56} />
      <FloatingEmoji emoji="☁️" style={styles.cloud1} axis="x" distance={16} duration={3800} size={38} />
      <FloatingEmoji emoji="☁️" style={styles.cloud2} axis="x" distance={12} duration={3000} size={28} />

      <Text style={styles.title}>Meus Animais</Text>

      <View style={styles.critters}>
        {featured.map((a, i) => (
          <FloatingImage
            key={a.id}
            source={a.faceImage!}
            imageStyle={styles.critterImage}
            axis="y"
            distance={8}
            duration={1400 + i * 350}
          />
        ))}
      </View>

      <View style={styles.grid}>
        {MENU.map((item, i) => (
          <BouncyButton
            key={item.route}
            style={[styles.button, { backgroundColor: FunColors[i % FunColors.length] }]}
            onPress={() => router.push(item.route)}
          >
            <Text style={styles.buttonText}>{item.label}</Text>
          </BouncyButton>
        ))}
      </View>

      <View style={styles.grass} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#BEE7FA',
  },
  sun: { position: 'absolute', top: 50, right: 30 },
  cloud1: { position: 'absolute', top: 90, left: 20 },
  cloud2: { position: 'absolute', top: 140, right: 70 },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: Fonts.rounded,
    marginBottom: 8,
    color: '#2D3436',
  },
  critters: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 28,
  },
  critterImage: {
    width: 64,
    height: 64,
    borderRadius: 32,
    resizeMode: 'cover',
    borderWidth: 3,
    borderColor: '#fff',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    width: '90%',
  },
  button: {
    padding: 16,
    borderRadius: 24,
    width: 190,
    minHeight: 100,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  buttonText: {
    color: '#fff',
    fontSize: 20,
    fontFamily: Fonts.rounded,
    fontWeight: '600',
    textAlign: 'center',
  },
  grass: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 60,
    backgroundColor: '#8BC34A',
    borderTopLeftRadius: 40,
    borderTopRightRadius: 40,
  },
});
