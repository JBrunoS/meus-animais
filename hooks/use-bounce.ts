import { useEffect, useState } from "react";
import { Animated, Easing } from "react-native";

export function useBounce(axis: "x" | "y" = "y", distance = 12, duration = 1800) {
  const [anim] = useState(() => new Animated.Value(0));

  useEffect(() => {
    const loop = Animated.loop(
      Animated.sequence([
        Animated.timing(anim, {
          toValue: 1,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
        Animated.timing(anim, {
          toValue: 0,
          duration,
          easing: Easing.inOut(Easing.sin),
          useNativeDriver: true,
        }),
      ]),
    );
    loop.start();
    return () => loop.stop();
  }, [duration]);

  const translate = anim.interpolate({ inputRange: [0, 1], outputRange: [-distance, distance] });
  return axis === "y" ? [{ translateY: translate }] : [{ translateX: translate }];
}
