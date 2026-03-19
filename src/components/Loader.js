// Loader.js
import React, { useEffect, useRef } from 'react';
import { View, Animated, StyleSheet } from 'react-native';

const Loader = ({ size = 'small', color = '#D4AF37' }) => {
  const dot1 = useRef(new Animated.Value(0)).current;
  const dot2 = useRef(new Animated.Value(0)).current;
  const dot3 = useRef(new Animated.Value(0)).current;

  const dotSize = size === 'large' ? 12 : 8;

  useEffect(() => {
    const animate = dot =>
      Animated.sequence([
        Animated.timing(dot, { toValue: 1, duration: 400, useNativeDriver: true }),
        Animated.timing(dot, { toValue: 0, duration: 400, useNativeDriver: true }),
      ]);

    Animated.loop(
      Animated.stagger(180, [animate(dot1), animate(dot2), animate(dot3)]),
    ).start();
  }, [dot1, dot2, dot3]);

  const dotStyle = (anim) => ({
    width: dotSize,
    height: dotSize,
    borderRadius: dotSize / 2,
    backgroundColor: color,
    marginHorizontal: 4,
    opacity: anim,
    transform: [
      {
        translateY: anim.interpolate({
          inputRange: [0, 1],
          outputRange: [0, -6],
        }),
      },
    ],
  });

  return (
    <View style={styles.container}>
      <Animated.View style={dotStyle(dot1)} />
      <Animated.View style={dotStyle(dot2)} />
      <Animated.View style={dotStyle(dot3)} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
});

export default Loader;