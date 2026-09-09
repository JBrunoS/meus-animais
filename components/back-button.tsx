import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { setIsAudioActiveAsync } from 'expo-audio';
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export function BackButton({ color = '#003366' }: { color?: string }) {
  const router = useRouter();

  function handlePress() {
    setIsAudioActiveAsync(false);
    router.replace("/");
  }

  return (
    <TouchableOpacity style={[styles.button, { backgroundColor: color }]} onPress={handlePress}>
      <FontAwesome6 name='arrow-left' size={16} color="#FFFFFF" />
      <Text style={styles.text}>  Voltar</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 50,
    left: 20,
    padding: 10,
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});
