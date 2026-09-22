import { Image } from 'expo-image';
import { router } from 'expo-router';
import React from 'react';
import { View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { LiveBanner, routeForHref, useBanners } from '../data/banners';
import { openStorePage } from '../lib/cart';
import { useTheme } from '../theme';
import { PressableScale } from './ui';

export function openBanner(href: string) {
  if (!href) return;
  const r = routeForHref(href);
  if ('web' in r) openStorePage(r.web);
  else router.push(r as any);
}

/** One hero slide, pulled live from rosierfoods.com. */
export function LiveBannerSlide({ banner, width, height }: { banner: LiveBanner; width: number; height: number }) {
  const t = useTheme();
  return (
    <PressableScale scaleTo={0.98} onPress={() => openBanner(banner.href)} style={{ width }}>
      <Image
        source={{ uri: banner.image }}
        style={{ width, height, borderRadius: 22, backgroundColor: t.card }}
        contentFit="cover"
        transition={300}
        cachePolicy="memory-disk"
        onLoad={(e) => {
          const { width: w, height: h } = e.source;
          if (!w || !h) return;
          const aspect = Math.min(3, Math.max(0.6, w / h));
          if (Math.abs(aspect - useBanners.getState().aspect) > 0.02) useBanners.setState({ aspect });
        }}
      />
    </PressableScale>
  );
}

/** The two club tiles that sit under the slider on the website. */
export function LiveTiles({ width }: { width: number }) {
  const t = useTheme();
  const tiles = useBanners((s) => s.tiles);
  if (!tiles.length) return null;
  const w = (width - 40 - 12) / 2;
  return (
    <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 20, marginTop: 16 }}>
      {tiles.slice(0, 2).map((b, i) => (
        <Animated.View key={b.id} entering={FadeInDown.delay(i * 100).springify()}>
          <PressableScale onPress={() => openBanner(b.href)} style={{ width: w }}>
            <Image source={{ uri: b.image }} style={{ width: w, height: w * 0.55, borderRadius: 16, backgroundColor: t.card }} contentFit="cover" transition={300} cachePolicy="memory-disk" />
          </PressableScale>
        </Animated.View>
      ))}
    </View>
  );
}
