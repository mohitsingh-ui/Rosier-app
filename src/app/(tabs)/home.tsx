import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { RefreshControl, ScrollView, Text, useWindowDimensions, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, interpolate, useAnimatedScrollHandler, useAnimatedStyle, useSharedValue } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Avatar } from '../../components/Avatar';
import { BenefitsBanner, Carousel, CoinsBanner, ProductBanner } from '../../components/Banners';
import { CategoryIcon } from '../../components/CategoryIcon';
import { Coin } from '../../components/Coin';
import { Pillars, Reviews } from '../../components/HomeExtras';
import { DealCard, GridCard } from '../../components/ProductCard';
import { CountUp, PressableScale, SectionHeader, Txt } from '../../components/ui';
import { CATEGORIES, defaultVariant, shopProducts, useCatalog, useProducts } from '../../data/catalog';
import { greeting } from '../../lib/format';
import { useApp } from '../../store/app';
import { useCoins } from '../../store/shop';
import { fonts, useTheme } from '../../theme';

const BESTSELLERS = [
  'a2-desi-cow-ghee-hand-churned-from-curd',
  'wild-flower-honey',
  'khapli-emmer-wheat-atta-stoneground-high-fiber-for-gut-health',
  'high-protein-oats-kulfi-masti',
  'wood-pressed-black-mustard-oil',
  'mango-pickle',
  'groundnut-oil',
  'wood-pressed-coconut-oil',
];

const TOP_TABS = [
  { key: 'rosier', label: 'ROSIER' },
  { key: 'breakfast', label: 'Breakfast\nclub' },
  { key: 'club', label: 'Benefit\nclub' },
  { key: 'now', label: 'Rosier\nNow' },
  { key: 'coins', label: 'Rosier\nCoins' },
];

export default function Home() {
  const t = useTheme();
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const products = useProducts();
  const loading = useCatalog((s) => s.loading);
  const refresh = useCatalog((s) => s.refresh);
  const name = useApp((s) => s.name);
  const unread = useApp((s) => s.notifications.filter((n) => !n.read).length);
  const openMenu = useApp((s) => s.setMenuOpen);
  const balance = useCoins((s) => s.balance);
  const [tab, setTab] = useState('rosier');

  const y = useSharedValue(0);
  const onScroll = useAnimatedScrollHandler((e) => {
    y.value = e.contentOffset.y;
  });
  const headerShadow = useAnimatedStyle(() => ({
    shadowOpacity: interpolate(y.value, [0, 40], [0, 0.15], 'clamp'),
    elevation: interpolate(y.value, [0, 40], [0, 8], 'clamp'),
  }));
  const greetStyle = useAnimatedStyle(() => ({
    height: interpolate(y.value, [0, 60], [58, 0], 'clamp'),
    opacity: interpolate(y.value, [0, 40], [1, 0], 'clamp'),
    marginBottom: interpolate(y.value, [0, 60], [12, 0], 'clamp'),
  }));

  const all = shopProducts(products);
  const byHandle = (h: string) => all.find((p) => p.handle === h);
  const deals = useMemo(
    () =>
      [...all]
        .filter((p) => p.category !== 'combos' && defaultVariant(p).available)
        .sort((a, b) => defaultVariant(b).discount - defaultVariant(a).discount)
        .filter((p, i, arr) => arr.findIndex((x) => x.category === p.category) === i || i < 3)
        .slice(0, 8),
    [all],
  );
  const best = BESTSELLERS.map(byHandle).filter(Boolean) as typeof all;
  const combos = all.filter((p) => p.category === 'combos').slice(0, 4);
  const cardW = (width - 20 * 2 - 12) / 2;
  const ghee = byHandle('a2-desi-cow-ghee-hand-churned-from-curd');
  const khapli = byHandle('khapli-emmer-wheat-atta-stoneground-high-fiber-for-gut-health');
  const oats = byHandle('high-protein-oats-mango-tango');

  const onTopTab = (k: string) => {
    setTab(k);
    if (k === 'breakfast') router.push({ pathname: '/collection/[id]', params: { id: 'breakfast' } });
    if (k === 'club') router.push('/benefits-club');
    if (k === 'now') router.push({ pathname: '/collection/[id]', params: { id: 'new' } });
    if (k === 'coins') router.navigate('/coins');
    setTimeout(() => setTab('rosier'), 600);
  };

  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      {/* Sticky header */}
      <Animated.View style={[{ backgroundColor: t.header, paddingTop: insets.top + 8, paddingHorizontal: 20, paddingBottom: 12, zIndex: 10, shadowColor: '#000', shadowRadius: 12, shadowOffset: { width: 0, height: 4 } }, headerShadow]}>
        <Animated.View style={[{ flexDirection: 'row', alignItems: 'center', overflow: 'hidden' }, greetStyle]}>
          <PressableScale onPress={() => openMenu(true)}>
            <Avatar size={54} />
          </PressableScale>
          <View style={{ marginLeft: 12, flex: 1 }}>
            <Text style={{ fontFamily: fonts.serif, fontSize: 22, color: t.text }} numberOfLines={1}>
              Hi {name}!
            </Text>
            <Text style={{ fontFamily: fonts.sans, fontSize: 13, color: t.textSoft }}>{greeting()}</Text>
          </View>
          <PressableScale
            onPress={() => router.navigate('/coins')}
            style={{ flexDirection: 'row', alignItems: 'center', gap: 8, backgroundColor: t.cardStrong, borderRadius: 16, paddingHorizontal: 10, paddingVertical: 7, shadowColor: '#5A3520', shadowOpacity: 0.12, shadowRadius: 8, elevation: 3 }}
          >
            <Coin size={30} spin />
            <View>
              <CountUp value={balance} style={{ fontFamily: fonts.sansSemi, fontSize: 16, color: t.text, lineHeight: 19 }} />
              <Text style={{ fontFamily: fonts.sans, fontSize: 9.5, color: t.textSoft }}>Rosier Coins</Text>
            </View>
            <Ionicons name="chevron-forward" size={16} color={t.text} />
          </PressableScale>
        </Animated.View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <PressableScale scaleTo={0.98} onPress={() => router.push('/search')} style={{ flex: 1, height: 48, borderRadius: 24, backgroundColor: t.cardStrong, flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, gap: 10 }}>
            <Ionicons name="search" size={20} color={t.textMute} />
            <Text style={{ fontFamily: fonts.sans, fontSize: 14, color: t.textMute, flex: 1 }} numberOfLines={1}>
              search for ghee, Khapli, oil...
            </Text>
            <Ionicons name="options-outline" size={20} color={t.textMute} />
          </PressableScale>
          <PressableScale onPress={() => router.push('/notifications')} style={{ width: 48, height: 48, borderRadius: 24, backgroundColor: t.cardStrong, alignItems: 'center', justifyContent: 'center' }}>
            <Ionicons name="notifications" size={22} color={t.textSoft} />
            {unread > 0 && (
              <Animated.View entering={FadeIn} style={{ position: 'absolute', top: 6, right: 7, minWidth: 16, height: 16, borderRadius: 8, backgroundColor: '#D64545', alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: '#fff', fontSize: 9, fontFamily: fonts.sansSemi }}>{unread}</Text>
              </Animated.View>
            )}
          </PressableScale>
        </View>
      </Animated.View>

      <Animated.ScrollView
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 130 }}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={refresh} tintColor={t.primary} />}
      >
        {/* Sub-brand tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 16, gap: 6, paddingTop: 4 }}>
          {TOP_TABS.map((tb, i) => {
            const active = tab === tb.key;
            return (
              <Animated.View key={tb.key} entering={FadeInDown.delay(i * 60)}>
                <PressableScale
                  onPress={() => onTopTab(tb.key)}
                  style={{ width: 82, height: 54, borderRadius: 10, borderBottomLeftRadius: 0, borderBottomRightRadius: 0, backgroundColor: active ? t.card : t.cardStrong, borderWidth: 1, borderColor: t.border, alignItems: 'center', justifyContent: 'center' }}
                >
                  {tb.key === 'rosier' ? (
                    <View style={{ alignItems: 'center' }}>
                      <Text style={{ fontFamily: fonts.serifBold, fontSize: 13, color: t.primary, letterSpacing: 1 }}>ROSIER</Text>
                      <Text style={{ fontFamily: fonts.sans, fontSize: 6, color: t.textSoft, letterSpacing: 1 }}>NATURE'S LOVE</Text>
                    </View>
                  ) : tb.key === 'breakfast' ? (
                    <Text style={{ fontFamily: fonts.sansBold, fontSize: 12, color: '#D6338A', textAlign: 'center', lineHeight: 13 }}>{tb.label}</Text>
                  ) : (
                    <Text style={{ fontFamily: fonts.serifRegular, fontSize: 13.5, color: t.text, textAlign: 'center', lineHeight: 16 }}>{tb.label}</Text>
                  )}
                </PressableScale>
              </Animated.View>
            );
          })}
        </ScrollView>

        <View style={{ marginTop: 14 }}>
          <Carousel
            width={width}
            slides={[
              <CoinsBanner key="c" width={width - 40} />,
              ghee && (
                <ProductBanner
                  key="g"
                  width={width - 40}
                  title={'A2 Gir\nCow Ghee'}
                  sub="Made from curd, the bilona way. Slow churned, never rushed."
                  image={ghee.images[0]}
                  colors={['#FFF3D6', '#F6D98C', '#E9B955']}
                  onPress={() => router.push({ pathname: '/product/[handle]', params: { handle: ghee.handle } })}
                />
              ),
              khapli && (
                <ProductBanner
                  key="k"
                  width={width - 40}
                  title={'Khapli\nAtta'}
                  sub="Ancient emmer wheat, stone ground on a chakki."
                  image={khapli.images[0]}
                  colors={['#E9F1DD', '#B8CFA0', '#7E9C62']}
                  onPress={() => router.push({ pathname: '/product/[handle]', params: { handle: khapli.handle } })}
                />
              ),
              oats && (
                <ProductBanner
                  key="o"
                  width={width - 40}
                  title={'High Protein\nOats'}
                  sub="Breakfast that keeps you full till lunch."
                  image={oats.images[0]}
                  colors={['#5A2E14', '#8C4A22', '#C47A48']}
                  light
                  onPress={() => router.push({ pathname: '/collection/[id]', params: { id: 'breakfast' } })}
                />
              ),
            ].filter(Boolean)}
          />
        </View>

        {/* Categories */}
        <SectionHeader title="Discover category" style={{ marginTop: 22 }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 14 }}>
          {CATEGORIES.map((c, i) => (
            <Animated.View key={c.id} entering={FadeInDown.delay(i * 70).springify()}>
              <PressableScale onPress={() => router.push({ pathname: '/collection/[id]', params: { id: c.id } })} style={{ alignItems: 'center', width: 76 }}>
                <View style={{ width: 72, height: 64, borderRadius: 12, backgroundColor: t.mode === 'dark' ? t.card : '#F4E3CF', alignItems: 'center', justifyContent: 'center' }}>
                  <CategoryIcon name={c.icon} size={44} color={t.mode === 'dark' ? '#D8A15A' : '#7E3F18'} />
                </View>
                <Text style={{ fontFamily: fonts.serifRegular, fontSize: 15, color: t.heading, marginTop: 6 }}>{c.label}</Text>
              </PressableScale>
            </Animated.View>
          ))}
        </ScrollView>

        {/* Limited deals */}
        <SectionHeader title="Limited deals" action="see all" onAction={() => router.push({ pathname: '/collection/[id]', params: { id: 'deals' } })} style={{ marginTop: 24 }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
          {deals.map((p, i) => (
            <DealCard key={p.handle} product={p} index={i} width={Math.min(160, (width - 60) / 3 + 16)} />
          ))}
        </ScrollView>

        <View style={{ marginTop: 26 }}>
          <BenefitsBanner width={width} />
        </View>

        {/* Loved across generations */}
        <Txt v="h1" style={{ textAlign: 'center', marginTop: 28, marginBottom: 4, fontFamily: fonts.serif }}>
          Loved Across Generations
        </Txt>
        <Txt v="small" color={t.textSoft} style={{ textAlign: 'center', marginBottom: 16 }}>
          The bestsellers our families keep coming back for
        </Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20 }}>
          {best.slice(0, 6).map((p, i) => (
            <GridCard key={p.handle} product={p} index={i} width={cardW} />
          ))}
        </View>

        {/* Buy more save more */}
        <Txt v="h2" style={{ textAlign: 'center', marginTop: 30, marginBottom: 14 }}>
          Buy More, Save More
        </Txt>
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12, paddingHorizontal: 20 }}>
          {combos.map((p, i) => (
            <GridCard key={p.handle} product={p} index={i} width={cardW} />
          ))}
        </View>
        <PressableScale
          onPress={() => router.navigate('/shop')}
          style={{ alignSelf: 'center', marginTop: 22, borderWidth: 1.5, borderColor: t.primary, borderRadius: 30, paddingHorizontal: 44, paddingVertical: 12 }}
        >
          <Text style={{ fontFamily: fonts.sansMedium, color: t.primary, letterSpacing: 3, fontSize: 13 }}>VIEW ALL</Text>
        </PressableScale>

        {ghee && (
          <View style={{ marginTop: 28 }}>
            <PressableScale scaleTo={0.98} onPress={() => router.push({ pathname: '/product/[handle]', params: { handle: ghee.handle } })}>
              <LinearGradient colors={['#FFF4DC', '#F6D98C']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={{ flexDirection: 'row', alignItems: 'center', paddingVertical: 18, paddingHorizontal: 20 }}>
                <View style={{ flex: 1.1, flexDirection: 'row' }}>
                  {[0, 1, 2].map((k) => (
                    <View key={k} style={{ width: 70, height: 100, marginLeft: k ? -18 : 0, transform: [{ rotate: `${(k - 1) * 6}deg` }] }}>
                      <Animated.Image entering={FadeInDown.delay(k * 120)} source={{ uri: ghee.images[0] }} style={{ width: '100%', height: '100%', borderRadius: 10 }} resizeMode="contain" />
                    </View>
                  ))}
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.serif, fontSize: 13, color: '#5A3A1E' }}>India's Best</Text>
                  <Text style={{ fontFamily: fonts.serifBold, fontSize: 26, color: '#3E2415', lineHeight: 30 }}>A2 Ghee</Text>
                  <Text style={{ fontFamily: fonts.sans, fontSize: 10.5, color: '#5A3A1E', marginTop: 4 }}>From free-grazing Gir cows. Churned from curd.</Text>
                  <View style={{ marginTop: 8, backgroundColor: '#3E2415', alignSelf: 'flex-start', borderRadius: 6, paddingHorizontal: 10, paddingVertical: 5 }}>
                    <Text style={{ color: '#FBE6CF', fontFamily: fonts.sansMedium, fontSize: 10 }}>Shop Now →</Text>
                  </View>
                </View>
              </LinearGradient>
            </PressableScale>
          </View>
        )}

        <SectionHeader title="Exciting deals" action="see all" onAction={() => router.navigate('/shop')} style={{ marginTop: 26 }} />
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 10 }}>
          {[...all.filter((p) => p.category === 'breakfast').slice(0, 5), ...all.filter((p) => p.category === 'pickles').slice(0, 3)]
            .map((p, i) => (
              <DealCard key={p.handle} product={p} index={i} width={Math.min(160, (width - 60) / 3 + 16)} />
            ))}
        </ScrollView>

        <Txt v="h2" style={{ marginTop: 30, marginBottom: 4, paddingHorizontal: 20 }}>
          More Than a Brand, A Family
        </Txt>
        <Txt v="small" color={t.textSoft} style={{ paddingHorizontal: 20, marginBottom: 14 }}>
          जड़ों से जुड़े लोग, असली बदलाव
        </Txt>
        <Reviews />

        <View style={{ marginTop: 30 }}>
          <Pillars />
        </View>

        <View style={{ alignItems: 'center', marginTop: 36, gap: 4 }}>
          <Text style={{ fontFamily: fonts.serifBold, fontSize: 28, color: t.border, letterSpacing: 4 }}>ROSIER</Text>
          <Text style={{ fontFamily: fonts.sans, fontSize: 12, color: t.textMute }}>Made with love in Bharat 🇮🇳</Text>
        </View>
      </Animated.ScrollView>
    </View>
  );
}
