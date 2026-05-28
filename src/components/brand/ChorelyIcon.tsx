import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { StyleProp, ViewStyle } from 'react-native';
import Svg, {
  Circle,
  Defs,
  LinearGradient,
  Path,
  Rect,
  Stop,
} from 'react-native-svg';

import { C } from '../../theme/tokens';

interface ChorelyIconProps {
  // Side length in px. Component is rendered into a square box.
  size?: number;
  // Override the inner face fill — defaults to white. Set to C.bg if you
  // want the icon to blend into a lavender background.
  faceFill?: string;
  // Override the dark feature color (eyes + smile).
  featureColor?: string;
  style?: StyleProp<ViewStyle>;
}

// The rounded-square smiley defined in DESIGN.md §1. Coordinates are in a
// 100×100 viewBox so the SVG scales cleanly at any size.
export function ChorelyIcon({
  size = 64,
  faceFill = C.textWhite,
  featureColor = C.textDark,
  style,
}: ChorelyIconProps) {
  return (
    <View style={[{ width: size, height: size }, style]}>
      <Svg width={size} height={size} viewBox="0 0 100 100">
        <Defs>
          <LinearGradient id="chorelyBorder" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={C.pink} />
            <Stop offset="1" stopColor={C.orange} />
          </LinearGradient>
        </Defs>
        <Rect
          x={4}
          y={4}
          width={92}
          height={92}
          rx={22}
          ry={22}
          fill={faceFill}
          stroke="url(#chorelyBorder)"
          strokeWidth={6}
        />
        <Circle cx={36} cy={42} r={5} fill={featureColor} />
        <Circle cx={64} cy={42} r={5} fill={featureColor} />
        <Path
          d="M30 62 Q50 82 70 62"
          stroke={featureColor}
          strokeWidth={5}
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </View>
  );
}

// Style preserved as a sentinel — keeps consumers from accidentally giving the
// icon a background that breaks the gradient stroke contrast.
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const _styles = StyleSheet.create({});
