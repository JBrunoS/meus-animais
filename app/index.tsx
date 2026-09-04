import { BouncyButton } from '@/components/bouncy-button';
import { FloatingEmoji, FloatingImage } from '@/components/floating-emoji';
import { Fonts, FunColors } from '@/constants/theme';
import { animals } from '@/data/animals';
import { shuffle } from '@/lib/shuffle';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

const MENU = [
  { icon: '🔊', label: 'Sons dos Animais', route: '/game' },
  { icon: '🍓', label: 'Hora da Comida', route: '/food' },
  { icon: '🐣', label: 'Quem é o Filhote?', route: '/pops' },
  { icon: '🏠', label: 'Onde ele Mora?', route: '/habitat' },
  { icon: '🧠', label: 'Jogo da Memória', route: '/memory' },
  { icon: '🔍', label: 'Adivinhe o Animal', route: '/silhouette' },
  { icon: '📘', label: 'Meu Álbum', route: '/album' },
] as const;

const FEATURED_POOL = animals.filter((a) => a.faceImage);

export default function Home() {
  const router = useRouter();
  const [featured] = useState(() => shuffle(FEATURED_POOL).slice(0, 4));

  return (
    <View style={styles.container}>
      <FloatingEmoji emoji="☀️" style={styles.sun} axis="y" distance={6} duration={2400} size={70} />
      <FloatingEmoji emoji="☁️" style={styles.cloud1} axis="x" distance={16} duration={3800} size={88} />
      <FloatingEmoji emoji="☁️" style={styles.cloud2} axis="x" distance={12} duration={3000} size={98} />
      <FloatingEmoji emoji="☁️" style={styles.cloud3} axis="x" distance={12} duration={3000} size={98} />
      <FloatingEmoji emoji="☁️" style={styles.cloud4} axis="x" distance={12} duration={3000} size={98} />
      <FloatingEmoji emoji="🕊️" style={styles.passaro1} axis="x" distance={200} duration={8000} size={38} />
      <FloatingEmoji emoji="🕊️" style={styles.passaro2} flip axis="x" distance={250} duration={10000} size={38} />

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
            <Text style={styles.buttonIcon}>{item.icon}</Text>
            <Text style={styles.buttonText}>{item.label}</Text>
          </BouncyButton>
        ))}
      </View>
      <FloatingEmoji emoji='🏔️' axis='x' distance={1} duration={3000} size={160} style={styles.mountain1} />
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
  sun: { position: 'absolute', top: 100, right: 30 },
  cloud1: { position: 'absolute', top: 190, left: 20 },
  cloud2: { position: 'absolute', top: 280, right: 60 },
  cloud3: { position: 'absolute', bottom: 180, right: 20 },
  cloud4: { position: 'absolute', bottom: 260, left: 60 },
  mountain1: { position: 'absolute', bottom: 20, right: 3, zIndex: 2 },
  passaro1: { position: 'absolute', bottom: 100, left: 180, },
  passaro2: { position: 'absolute', top: 280, left: 180 },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    fontFamily: Fonts.rounded,
    marginBottom: 8,
    color: '#2D3436',
  },
  critters: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: 90,
    width: '90%'
  },
  critterImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
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
    zIndex: 4,
  },
  button: {
    padding: 16,
    borderRadius: 24,
    width: 190,
    height: 120,
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
    display: 'flex',
    flexDirection: 'column',
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    // textShadowColor: '#003366',
    textShadowColor: 'black', // Cor da borda
    textShadowOffset: { width: 1, height: 0 }, // Posição
    textShadowRadius: 3, // Mantém a borda nítida
    fontWeight: '600',
    textAlign: 'center',
  },
  buttonIcon: {
    color: '#fff',
    fontSize: 35,
    // fontFamily: Fonts.rounded,
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
