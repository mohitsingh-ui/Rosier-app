import { Image } from 'expo-image';
import React, { useState } from 'react';
import { Text, View } from 'react-native';
import { fonts } from '../theme';

/** Official Rosier logo (emblem + wordmark), served from rosierfoods.com. */
export const LOGO_URL = 'https://www.rosierfoods.com/cdn/shop/files/black-logo-01_7f1cd910-121f-49c7-bdcf-248849cd14f5.webp?width=600';
const RATIO = 500 / 333;

export const TAGLINE = 'Reviving the tradition of Bharat';

/**
 * The logo file is black on transparent, so `color` recolours it
 * (brown on cream, cream on dark brown, gold on black…).
 */
export function RosierLogo({ width = 120, color = '#3E2415' }: { width?: number; color?: string }) {
  const [failed, setFailed] = useState(false);
  const height = width / RATIO;
  if (failed) {
    return (
      <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
        <Text style={{ fontFamily: fonts.serifBold, fontSize: width * 0.2, color, letterSpacing: width * 0.02 }}>ROSIER</Text>
      </View>
    );
  }
  return (
    <Image
      source={{ uri: LOGO_URL }}
      style={{ width, height }}
      contentFit="contain"
      tintColor={color}
      cachePolicy="disk"
      transition={200}
      onError={() => setFailed(true)}
    />
  );
}
