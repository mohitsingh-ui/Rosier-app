import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Linking, Pressable, ScrollView, Text, View } from 'react-native';
import Animated, { FadeIn, FadeInDown, LinearTransition } from 'react-native-reanimated';
import { PressableScale, ScreenHeader, Txt } from '../components/ui';
import { COINS } from '../config/coins';
import { openStorePage } from '../lib/cart';
import { fonts, useTheme } from '../theme';

const PHONE = '+919205658884';
const EMAIL = 'care@rosierfoods.com';

const FAQ = [
  ['What is A2 ghee?', 'Ghee made from the milk of indigenous cows like the Gir, which carries the A2 type of beta-casein protein. Ours is made from curd using the bilona method.'],
  ['What does "bilona" mean?', 'Milk is set into curd overnight, then churned with a wooden churner to separate the butter. That butter is slow cooked into ghee. It takes longer, and we think it tastes better.'],
  ['What is Khapli atta?', 'Khapli is emmer wheat, an ancient heritage grain. We stone grind it on a chakki so the bran and fibre stay in.'],
  ['How do I pay?', 'Checkout happens securely on rosierfoods.com, with the same payment options you get on our website.'],
  ['How do Rosier Coins work?', `You earn ${Math.round(COINS.earnPerRupee * 100)} coins for every ₹100. Swap them for vouchers from the Coins tab or right in your cart.`],
  ['Where can I track my order?', 'Open Orders in the app, or log in to your account on rosierfoods.com for live tracking and invoices.'],
];

export default function Help() {
  const t = useTheme();
  const [open, setOpen] = useState<number | null>(null);
  const actions: { icon: keyof typeof MaterialCommunityIcons.glyphMap; label: string; sub: string; go: () => void }[] = [
    { icon: 'phone-outline', label: 'Call us', sub: '+91-9205658884', go: () => Linking.openURL(`tel:${PHONE}`) },
    { icon: 'email-outline', label: 'Email us', sub: EMAIL, go: () => Linking.openURL(`mailto:${EMAIL}`) },
    { icon: 'web', label: 'Contact form', sub: 'rosierfoods.com/contact', go: () => openStorePage('/pages/contact') },
  ];
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScreenHeader title="Help & Support" />
      <ScrollView contentContainerStyle={{ padding: 20, paddingBottom: 60 }}>
        <Txt v="h2">We'd love to hear from you</Txt>
        <Txt v="body" color={t.textSoft} style={{ marginTop: 4 }}>
          Questions about an order, a product or your coins? Reach us any way you like.
        </Txt>
        <View style={{ gap: 10, marginTop: 18 }}>
          {actions.map((a, i) => (
            <Animated.View key={a.label} entering={FadeInDown.delay(i * 70).springify()}>
              <PressableScale onPress={a.go} style={{ flexDirection: 'row', alignItems: 'center', gap: 14, backgroundColor: t.cardStrong, borderRadius: 18, padding: 14, borderWidth: 1, borderColor: t.border }}>
                <View style={{ width: 46, height: 46, borderRadius: 23, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center' }}>
                  <MaterialCommunityIcons name={a.icon} size={22} color={t.primary} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ fontFamily: fonts.sansSemi, fontSize: 15, color: t.text }}>{a.label}</Text>
                  <Text style={{ fontFamily: fonts.sans, fontSize: 12.5, color: t.textSoft }}>{a.sub}</Text>
                </View>
                <Ionicons name="chevron-forward" size={18} color={t.textMute} />
              </PressableScale>
            </Animated.View>
          ))}
        </View>

        <Txt v="h3" style={{ marginTop: 28, marginBottom: 10 }}>
          FAQs
        </Txt>
        {FAQ.map(([q, a], i) => {
          const isOpen = open === i;
          return (
            <Animated.View key={q} layout={LinearTransition.springify().damping(18)} style={{ backgroundColor: t.cardStrong, borderRadius: 16, marginBottom: 10, borderWidth: 1, borderColor: t.border, overflow: 'hidden' }}>
              <Pressable onPress={() => setOpen(isOpen ? null : i)} style={{ flexDirection: 'row', alignItems: 'center', padding: 14 }}>
                <Text style={{ flex: 1, fontFamily: fonts.sansMedium, fontSize: 14, color: t.text }}>{q}</Text>
                <Ionicons name={isOpen ? 'remove' : 'add'} size={20} color={t.primary} />
              </Pressable>
              {isOpen && (
                <Animated.Text entering={FadeIn.duration(250)} style={{ fontFamily: fonts.sans, fontSize: 13, color: t.textSoft, paddingHorizontal: 14, paddingBottom: 14, lineHeight: 20 }}>
                  {a}
                </Animated.Text>
              )}
            </Animated.View>
          );
        })}

        <View style={{ marginTop: 18, backgroundColor: t.card, borderRadius: 18, padding: 16 }}>
          <Text style={{ fontFamily: fonts.sansSemi, fontSize: 14, color: t.text }}>Rosier Foods Pvt. Ltd.</Text>
          <Text style={{ fontFamily: fonts.sans, fontSize: 13, color: t.textSoft, marginTop: 4, lineHeight: 20 }}>
            House No. B-2994/75, Gali No. 75, B-Block Sant Nagar, Burari, North West, Delhi - 110084
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}
