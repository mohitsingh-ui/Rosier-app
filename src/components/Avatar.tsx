import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Text } from 'react-native';
import { useApp } from '../store/app';
import { fonts } from '../theme';

export function Avatar({ size = 52 }: { size?: number }) {
  const name = useApp((s) => s.name);
  const initials = name
    .split(' ')
    .map((p) => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
  return (
    <LinearGradient
      colors={['#C47A48', '#7E3F18']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 3,
        borderColor: '#FFF5E8',
      }}
    >
      <Text style={{ color: '#FFF5E8', fontFamily: fonts.serifBold, fontSize: size * 0.38 }}>{initials || 'R'}</Text>
    </LinearGradient>
  );
}
