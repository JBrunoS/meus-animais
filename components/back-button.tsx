import FontAwesome6 from '@expo/vector-icons/FontAwesome6';
import { useRouter } from "expo-router";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

export function BackButton() {
  const router = useRouter();
  return (
    <TouchableOpacity style={styles.button} onPress={() => router.push("/")}>
      <FontAwesome6 name='arrow-left' size={16} color="#FFFFFF" />
      {/* <FontAwesome6 name="house" size={16} color="#FFFFFF" /> */}
      <Text style={styles.text}>  Voltar para Início</Text>
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
    backgroundColor: '#003366',
    borderRadius: 8,
  },
  text: {
    fontSize: 16,
    color: "#FFFFFF",
  },
});
