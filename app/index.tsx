import { useRouter } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Meus Animais</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/game')}
      >
        <Text style={styles.buttonText}>🔊 Jogo de Sons</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/food')}
      >
        <Text style={styles.buttonText}>🍓 Alimentando os animais</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/pops')}
      >
        <Text style={styles.buttonText}> Jogo dos filhotes</Text>
      </TouchableOpacity>
      
      <TouchableOpacity
        style={styles.button}
        onPress={() => router.push('/album')}
      >
        <Text style={styles.buttonText}>📘 Meu Álbum</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 28, marginBottom: 40 },
  button: {
    backgroundColor: '#6C5CE7',
    padding: 20,
    borderRadius: 20,
    marginVertical: 10,
    width: '80%',
  },
  buttonText: { color: '#fff', fontSize: 20, textAlign: 'center' },
});