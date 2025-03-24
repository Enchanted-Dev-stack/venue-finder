import React from 'react';
import Svg, { Circle, Path } from 'react-native-svg';

type LogoSVGProps = {
  width?: number;
  height?: number;
  color?: string;
};

export default function LogoSVG({ 
  width = 120, 
  height = 120, 
  color = '#FFFFFF' 
}: LogoSVGProps) {
  return (
    <Svg width={width} height={height} viewBox="0 0 120 120" fill="none">
      <Circle cx="60" cy="60" r="50" fill="#3b82f6" />
      <Circle cx="60" cy="60" r="40" fill="#2563eb" />
      <Path
        d="M40 75 L60 40 L80 75 Z"
        fill={color}
        strokeWidth="2"
        stroke={color}
      />
      <Circle cx="60" cy="55" r="8" fill={color} />
    </Svg>
  );
} 