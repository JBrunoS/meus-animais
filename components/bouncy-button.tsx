import { useState } from "react";
import { Animated, Pressable, type StyleProp, type ViewStyle } from "react-native";

export function BouncyButton({
  style,
  onPress,
  children,
  disabled,
}: {
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
  children: React.ReactNode;
  disabled?: boolean;
}) {
  const [scale] = useState(() => new Animated.Value(1));

  function animateTo(value: number) {
    Animated.spring(scale, {
      toValue: value,
      useNativeDriver: true,
      speed: 40,
      bounciness: 12,
    }).start();
  }

  return (
    <Pressable
      onPress={onPress}
      onPressIn={() => animateTo(0.92)}
      onPressOut={() => animateTo(1)}
      disabled={disabled}
    >
      <Animated.View style={[style, { transform: [{ scale }] }]}>
        {children}
      </Animated.View>
    </Pressable>
  );
}
