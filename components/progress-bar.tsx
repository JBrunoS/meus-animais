import { StyleSheet, Text, View } from "react-native";

export function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <>
      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${((current + 1) / total) * 100}%` }]} />
      </View>
      <Text style={styles.text}>
        Fase {current + 1} / {total}
      </Text>
    </>
  );
}

const styles = StyleSheet.create({
  bar: {
    width: "80%",
    height: 10,
    backgroundColor: "#DDD",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 40,
  },
  fill: {
    height: "100%",
    backgroundColor: "#6C5CE7",
  },
  text: {
    marginTop: 10,
    fontSize: 16,
  },
});
