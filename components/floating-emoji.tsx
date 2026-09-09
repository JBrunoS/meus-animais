import { useBounce } from "@/hooks/use-bounce";
import { Animated, Image, StyleSheet, type ImageSourcePropType, type ImageStyle, type StyleProp, type TextStyle, type ViewStyle } from "react-native";

export function FloatingEmoji({
  emoji,
  style,
  axis = "y",
  distance = 12,
  duration = 1800,
  size = 40,
  flip = false,
}: {
  emoji: string;
  style?: StyleProp<TextStyle>;
  axis?: "x" | "y";
  distance?: number;
  duration?: number;
  size?: number;
  flip?: boolean;
}) {
  const bounce = useBounce(axis, distance, duration);
  const transform = flip ? [...bounce, { scaleX: -1 }] : bounce;

  return (
    <Animated.Text style={[styles.emoji, { fontSize: size, transform }, style]}>
      {emoji}
    </Animated.Text>
  );
}

export function FloatingImage({
  source,
  style,
  imageStyle,
  axis = "y",
  distance = 12,
  duration = 1800,
}: {
  source: ImageSourcePropType;
  style?: StyleProp<ViewStyle>;
  imageStyle?: StyleProp<ImageStyle>;
  axis?: "x" | "y";
  distance?: number;
  duration?: number;
}) {
  const transform = useBounce(axis, distance, duration);

  return (
    <Animated.View style={[style, { transform }]}>
      <Image source={source} style={imageStyle} />
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  emoji: { textAlign: "center" },
});
