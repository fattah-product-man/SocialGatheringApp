import React, { type ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  Canvas,
  RoundedRect,
  LinearGradient,
  vec,
  BlurMask,
} from '@shopify/react-native-skia';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useEffect } from 'react';

export interface GlowCardProps {
  /** Glow intensity multiplier (default: 1) */
  intensity?: number;
  /** Gradient color stops */
  colors?: string[];
  /** Card content */
  children: ReactNode;
  /** Card width (default: 300) */
  width?: number;
  /** Card height (default: 180) */
  height?: number;
  /** Border radius (default: 20) */
  borderRadius?: number;
}

const AnimatedCanvas = Animated.createAnimatedComponent(Canvas);

export function GlowCard({
  intensity = 1,
  colors = ['#a78bfa', '#6d28d9', '#4c1d95'],
  children,
  width = 300,
  height = 180,
  borderRadius = 20,
}: GlowCardProps) {
  const rotation = useSharedValue(0);

  useEffect(() => {
    rotation.value = withRepeat(
      withTiming(360, { duration: 3000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [rotation]);

  const glowStyle = useAnimatedStyle(() => {
    return {
      transform: [{ rotate: `${rotation.value}deg` }],
    };
  });

  const blurSigma = 12 * intensity;
  const glowPadding = 20 * intensity;
  const canvasWidth = width + glowPadding * 2;
  const canvasHeight = height + glowPadding * 2;

  return (
    <View style={[styles.container, { width, height }]}>
      {/* Rotating glow layer behind the card */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            width: canvasWidth,
            height: canvasHeight,
            left: -glowPadding,
            top: -glowPadding,
          },
          glowStyle,
        ]}
      >
        <Canvas style={{ width: canvasWidth, height: canvasHeight }}>
          <RoundedRect
            x={glowPadding / 2}
            y={glowPadding / 2}
            width={width + glowPadding}
            height={height + glowPadding}
            r={borderRadius + 4}
          >
            <LinearGradient
              start={vec(0, 0)}
              end={vec(canvasWidth, canvasHeight)}
              colors={colors}
            />
            <BlurMask blur={blurSigma} style="normal" />
          </RoundedRect>
        </Canvas>
      </Animated.View>

      {/* Gradient border ring */}
      <Canvas
        style={[
          StyleSheet.absoluteFill,
          { width: width + 4, height: height + 4, left: -2, top: -2 },
        ]}
      >
        <RoundedRect
          x={0}
          y={0}
          width={width + 4}
          height={height + 4}
          r={borderRadius + 2}
        >
          <LinearGradient
            start={vec(0, 0)}
            end={vec(width + 4, height + 4)}
            colors={colors}
          />
        </RoundedRect>
      </Canvas>

      {/* Inner card surface */}
      <View
        style={[
          styles.innerCard,
          {
            width,
            height,
            borderRadius,
          },
        ]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'visible',
  },
  innerCard: {
    backgroundColor: 'rgba(24, 24, 27, 0.85)',
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
