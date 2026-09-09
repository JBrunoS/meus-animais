import { BouncyButton } from '@/components/bouncy-button';
import { FloatingEmoji } from '@/components/floating-emoji';
import { Fonts, FunColors } from '@/constants/theme';
import { animals } from '@/data/animals';
import { setIsAudioActiveAsync, useAudioPlayer, useAudioPlayerStatus } from 'expo-audio';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback } from 'react';
import { Image, ScrollView, StyleSheet, Text, View } from 'react-native';

const HERO_IMAGE = require('../assets/images/hero/hero-image.png');
const HERO_ASPECT_RATIO = 677 / 369;
const HOME_SONG = require('../assets/songs/home-song.mp3');

function findAnimal(id: string) {
  return animals.find((a) => a.id === id)!;
}

const MENU = [
  { image: findAnimal('dog').adultImage, badge: '🔊', silhouette: false, label: 'Sons', route: '/game' },
  { image: findAnimal('cat').adultImage, badge: '🍓', silhouette: false, label: 'Comida', route: '/food' },
  { image: findAnimal('elephant').babyImage, badge: null, silhouette: false, label: 'Filhotes', route: '/pops' },
  { image: findAnimal('giraffe').adultImage, badge: '🏠', silhouette: false, label: 'Onde Mora', route: '/habitat' },
  { image: findAnimal('owl').adultImage, badge: '🧠', silhouette: false, label: 'Memória', route: '/memory' },
  { image: findAnimal('penguin').adultImage, badge: null, silhouette: true, label: 'Adivinhe', route: '/silhouette' },
  { image: findAnimal('lion').adultImage, badge: '📘', silhouette: false, label: 'Álbum', route: '/album' },
] as const;

export default function Home() {
  const router = useRouter();
  const player = useAudioPlayer(HOME_SONG);
  const musicStatus = useAudioPlayerStatus(player);

  useFocusEffect(
    useCallback(() => {
      setIsAudioActiveAsync(true);
      // expo-audio's AudioPlayer is a native handle meant to be mutated directly
      // (its own docs set player.volume the same way).
      // eslint-disable-next-line react-hooks/immutability
      player.loop = true;
      player.play();

      return () => {
        player.pause();
      };
    }, [player]),
  );

  return (
    <View style={styles.container}>
      <FloatingEmoji emoji="☀️" style={styles.sun} axis="y" distance={6} duration={2400} size={70} />
      <FloatingEmoji emoji="☁️" style={styles.cloud1} axis="x" distance={16} duration={3800} size={88} />
      <FloatingEmoji emoji="☁️" style={styles.cloud2} axis="x" distance={12} duration={3000} size={98} />
      <FloatingEmoji emoji="☁️" style={styles.cloud3} axis="x" distance={12} duration={3000} size={98} />
      <FloatingEmoji emoji="☁️" style={styles.cloud4} axis="x" distance={12} duration={3000} size={98} />
      <FloatingEmoji emoji="🕊️" style={styles.passaro1} axis="x" distance={200} duration={8000} size={38} />
      <FloatingEmoji emoji="🕊️" style={styles.passaro2} flip axis="x" distance={250} duration={10000} size={38} />

      <BouncyButton
        style={styles.musicButton}
        onPress={() => (musicStatus.playing ? player.pause() : player.play())}
      >
        <Text style={styles.musicIcon}>{musicStatus.playing ? '🔊' : '🔇'}</Text>
      </BouncyButton>

      <View style={styles.heroWrap}>
        <Image source={HERO_IMAGE} style={styles.heroImage} />
        {/* <Text style={styles.title}>Meus Animais</Text> */}
      </View>

      <ScrollView
        style={styles.scrollArea}
        contentContainerStyle={styles.grid}
        showsVerticalScrollIndicator={false}
      >
        {MENU.map((item, i) => (
          <BouncyButton
            key={item.route}
            style={[styles.button, { backgroundColor: FunColors[i % FunColors.length] }]}
            onPress={() => router.push(item.route)}
          >
            <View style={styles.photoWrap}>
              <Image
                source={item.image}
                style={[styles.photo, item.silhouette && styles.photoSilhouette]}
              />
              {item.badge && (
                <View style={styles.badge}>
                  <Text style={styles.badgeText}>{item.badge}</Text>
                </View>
              )}
            </View>
            <Text style={styles.buttonText}>{item.label}</Text>
          </BouncyButton>
        ))}
      </ScrollView>
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
    paddingTop: 130,
    paddingBottom: 30,
  },
  sun: { position: 'absolute', top: 100, right: 30 },
  cloud1: { position: 'absolute', top: 190, left: 20 },
  cloud2: { position: 'absolute', top: 280, right: 60 },
  cloud3: { position: 'absolute', bottom: 180, right: 20 },
  cloud4: { position: 'absolute', bottom: 260, left: 60 },
  mountain1: { position: 'absolute', bottom: 20, right: 3, zIndex: 2 },
  passaro1: { position: 'absolute', bottom: 100, left: 180, },
  passaro2: { position: 'absolute', top: 280, left: 180 },
  musicButton: {
    position: 'absolute',
    top: -60,
    right: 142,
    width: 64,
    height: 64,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 5,
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 4,
  },
  musicIcon: { fontSize: 30 },

  heroWrap: {
    width: '100%',
    aspectRatio: HERO_ASPECT_RATIO,
    marginBottom: 12,
  },
  heroImage: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
  scrollArea: {
    flex: 1,
    width: '100%',
    zIndex: 4,
    paddingTop: 40,
    
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: 14,
    paddingBottom: 16,

    // backgroundColor: 'red'
  },
  button: {
    padding: 24,
    borderRadius: 24,
    width: '100%',
    height: 140,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 4,
  },
  photoWrap: {
    width: 82,
    height: 82,
    borderRadius: 41,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.7)',
  },
  photo: {
    width: 74,
    height: 74,
    borderRadius: 37,
    resizeMode: 'cover',
  },
  photoSilhouette: {
    width: 108,
    height: 108,
    resizeMode: 'contain',
    tintColor: '#2D3436',
    opacity: 0.4,
  },
  badge: {
    position: 'absolute',
    bottom: -4,
    right: -4,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#2D3436',
  },
  badgeText: {
    fontSize: 15,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    textShadowColor: 'black',
    textShadowOffset: { width: 1, height: 0 },
    textShadowRadius: 3,
    fontWeight: '600',
    textAlign: 'center',
    fontFamily: Fonts.rounded,
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
