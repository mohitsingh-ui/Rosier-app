import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React, { useState } from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown, SlideInDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { openProduct } from '../components/ProductCard';
import { Button, ScreenHeader } from '../components/ui';
import { findProduct, useProducts } from '../data/catalog';
import { fonts, useTheme } from '../theme';

type Article = { id: string; title: string; kicker: string; mins: number; icon: keyof typeof MaterialCommunityIcons.glyphMap; colors: [string, string]; product?: string; body: string[] };

const ARTICLES: Article[] = [
  {
    id: 'bilona',
    title: 'Curd, churn, cook: how bilona ghee is made',
    kicker: 'Tradition',
    mins: 3,
    icon: 'pot-mix-outline',
    colors: ['#F6D98C', '#C98A52'],
    product: 'a2-desi-cow-ghee-hand-churned-from-curd',
    body: [
      'Most ghee on the shelf is made from cream or butter. Bilona ghee takes the long road.',
      'First, whole milk from Gir cows is boiled, cooled and set into curd overnight. Next morning, the curd is churned with a wooden bilona until the butter (makkhan) separates from the buttermilk.',
      'That butter is then slowly cooked until the moisture leaves and what remains is golden, grainy ghee with a nutty aroma.',
      'It takes a lot more milk and a lot more time. That is exactly why it tastes the way Dadi’s did.',
    ],
  },
  {
    id: 'khapli',
    title: 'Khapli: the ancient wheat making a comeback',
    kicker: 'Grains',
    mins: 3,
    icon: 'grain',
    colors: ['#DCE7C9', '#7E9C62'],
    product: 'khapli-emmer-wheat-atta-stoneground-high-fiber-for-gut-health',
    body: [
      'Khapli, or emmer wheat, is one of the oldest cultivated grains. It was grown across India long before modern wheat varieties took over.',
      'We stone grind it on a chakki at low speed. The flour stays cooler, and the bran and fibre stay in.',
      'Rotis come out a little darker and nuttier than regular atta. Give it two or three meals, and most families don’t go back.',
    ],
  },
  {
    id: 'oils',
    title: 'Why stone pressed oil tastes different',
    kicker: 'Kitchen',
    mins: 2,
    icon: 'bottle-tonic-outline',
    colors: ['#F6E6B8', '#D9A441'],
    product: 'wood-pressed-black-mustard-oil',
    body: [
      'Most refined oils are extracted with heat and chemical solvents, then bleached and deodorised.',
      'Stone pressing crushes seeds slowly, at low temperature, with nothing added. The oil keeps its natural colour, aroma and flavour.',
      'That’s why our mustard oil has its signature punch, and our groundnut oil actually smells of groundnuts.',
    ],
  },
  {
    id: 'coins',
    title: 'Your guide to Rosier Coins',
    kicker: 'Rewards',
    mins: 1,
    icon: 'database-outline',
    colors: ['#F3D48B', '#9C6B1C'],
    body: [
      'Every order earns you Rosier Coins. Every product page shows exactly how many.',
      'Coins show as pending first, then unlock a few days later. Once they’re in, swap them for ₹50 to ₹500 off vouchers from the Coins tab or right in your cart.',
      'Changed your mind? Remove the voucher and your coins come straight back.',
    ],
  },
];

export default function Blog() {
  const t = useTheme();
  const insets = useSafeAreaInsets();
  const products = useProducts();
  const [open, setOpen] = useState<Article | null>(null);
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScreenHeader title="Blog & Articles" />
      <ScrollView contentContainerStyle={{ padding: 16, gap: 14, paddingBottom: 40 }}>
        {ARTICLES.map((a, i) => (
          <Animated.View key={a.id} entering={FadeInDown.delay(i * 80).springify()}>
            <Pressable onPress={() => setOpen(a)} style={{ backgroundColor: t.cardStrong, borderRadius: 22, overflow: 'hidden', borderWidth: 1, borderColor: t.border }}>
              <LinearGradient colors={a.colors} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ height: 130, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name={a.icon} size={64} color="rgba(62,36,21,0.75)" />
              </LinearGradient>
              <View style={{ padding: 16 }}>
                <Text style={{ fontFamily: fonts.sansSemi, fontSize: 11, color: t.primary, letterSpacing: 1.5, textTransform: 'uppercase' }}>
                  {a.kicker} · {a.mins} min read
                </Text>
                <Text style={{ fontFamily: fonts.serif, fontSize: 20, color: t.text, marginTop: 4, lineHeight: 26 }}>{a.title}</Text>
                <Text style={{ fontFamily: fonts.sans, fontSize: 13, color: t.textSoft, marginTop: 6 }} numberOfLines={2}>
                  {a.body[0]}
                </Text>
              </View>
            </Pressable>
          </Animated.View>
        ))}
      </ScrollView>

      <Modal visible={!!open} transparent animationType="fade" onRequestClose={() => setOpen(null)}>
        <View style={{ flex: 1, backgroundColor: t.overlay, justifyContent: 'flex-end' }}>
          {open && (
            <Animated.View entering={SlideInDown.springify().damping(18)} style={{ maxHeight: '88%', backgroundColor: t.bg, borderTopLeftRadius: 28, borderTopRightRadius: 28, overflow: 'hidden' }}>
              <LinearGradient colors={open.colors} style={{ height: 140, alignItems: 'center', justifyContent: 'center' }}>
                <MaterialCommunityIcons name={open.icon} size={70} color="rgba(62,36,21,0.75)" />
                <Pressable onPress={() => setOpen(null)} style={{ position: 'absolute', top: 14, right: 14, width: 36, height: 36, borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.7)', alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialCommunityIcons name="close" size={20} color="#3E2415" />
                </Pressable>
              </LinearGradient>
              <ScrollView contentContainerStyle={{ padding: 22, paddingBottom: insets.bottom + 24 }}>
                <Text style={{ fontFamily: fonts.serifBold, fontSize: 26, color: t.heading, lineHeight: 32 }}>{open.title}</Text>
                {open.body.map((p, i) => (
                  <Animated.Text key={i} entering={FadeInDown.delay(100 + i * 80)} style={{ fontFamily: fonts.sans, fontSize: 15.5, color: t.text, lineHeight: 25, marginTop: 12 }}>
                    {p}
                  </Animated.Text>
                ))}
                {open.product && findProduct(products, open.product) && (
                  <Button
                    label="Shop the product"
                    style={{ marginTop: 22 }}
                    onPress={() => {
                      const p = findProduct(products, open.product!)!;
                      setOpen(null);
                      openProduct(p);
                    }}
                  />
                )}
              </ScrollView>
            </Animated.View>
          )}
        </View>
      </Modal>
    </View>
  );
}
