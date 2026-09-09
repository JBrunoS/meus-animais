import { StyleSheet, Text, View } from "react-native";

export function ProgressBar({ current, total }: { current: number; total: number }) {
  return (
    <View style={styles.content}>
      <View style={styles.bar}>
        <View style={[styles.fill, { width: `${((current + 1) / total) * 100}%` }]} />
      </View>
      <Text style={styles.text}>
        Fase {current + 1} / {total}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  content: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    width: "90%",
    paddingVertical: 12,
    backgroundColor: "#FFFFFF",
    marginTop: 20,
    borderRadius: 16,
    borderWidth: 5,
    borderColor: '#274197'
  },
  bar: {
    width: "90%",
    height: 10,
    backgroundColor: "#DDD",
    borderRadius: 10,
    overflow: "hidden",
    marginTop: 2,
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
