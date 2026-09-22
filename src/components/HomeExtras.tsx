import { MaterialCommunityIcons } from '@expo/vector-icons';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInRight } from 'react-native-reanimated';
import { fonts, useTheme } from '../theme';
import { Txt } from './ui';

/** Customer words shown on rosierfoods.com */
export const REVIEWS = [
  { title: 'Rich Tradition in Every Drop', body: 'Rosier Foods’ A2 Desi Cow Ghee brings the richness of tradition to my kitchen. Its pure taste elevates every dish beautifully.', name: 'Sushmita', product: 'Gir Cow A2 Ghee' },
  { title: 'Pure Aroma, Authentic Taste!', body: 'A2 Desi Cow Ghee from Rosier Foods gives my cooking a rich, authentic flavor. The purity and aroma are unmatched—my family loves it!', name: 'Ankush S.', product: 'Gir Cow A2 Ghee' },
  { title: 'Old-school fuel. Real results.', body: 'Balancing endurance sports, a demanding IT career, and family life has taught me that food needs to do more than just fill the plate.', name: 'Sumit Suhag', product: 'Gir Cow A2 Ghee' },
  { title: 'Healthy Choice for Everyday Meals!', body: 'Switching to Khapli Wheat Atta from Rosier Foods was the best choice for our health. It’s fresh, nutritious, and perfect for our daily meals!', name: 'Alisha A.', product: 'Khapli (Emmer) Wheat Atta' },
  { title: 'Taste That Feels Like Home', body: 'Using A2 Desi Cow Ghee from Rosier Foods makes my meals comforting and flavorful. The quality and purity are simply outstanding.', name: 'Himanshi S.', product: 'Gir Cow A2 Ghee' },
];

export function Reviews() {
  const t = useTheme();
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }} snapToInterval={272} decelerationRate="fast">
      {REVIEWS.map((r, i) => (
        <Animated.View key={r.name} entering={FadeInRight.delay(i * 90).springify()} style={{ width: 260, backgroundColor: t.cardStrong, borderRadius: 20, padding: 16, borderWidth: 1, borderColor: t.border }}>
          <MaterialCommunityIcons name="format-quote-open" size={28} color={t.gold} />
          <Text style={{ fontFamily: fonts.serif, fontSize: 16, color: t.heading, marginTop: 2 }}>{r.title}</Text>
          <Text style={{ fontFamily: fonts.sans, fontSize: 12.5, color: t.textSoft, marginTop: 6, lineHeight: 19 }} numberOfLines={5}>
            {r.body}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 12, gap: 8 }}>
            <View style={{ width: 30, height: 30, borderRadius: 15, backgroundColor: t.card, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ fontFamily: fonts.serifBold, color: t.primary }}>{r.name[0]}</Text>
            </View>
            <View>
              <Text style={{ fontFamily: fonts.sansSemi, fontSize: 12, color: t.text }}>{r.name}</Text>
              <Text style={{ fontFamily: fonts.sans, fontSize: 10, color: t.textMute }}>{r.product}</Text>
            </View>
            <View style={{ marginLeft: 'auto', flexDirection: 'row' }}>
              {[0, 1, 2, 3, 4].map((k) => (
                <MaterialCommunityIcons key={k} name="star" size={12} color={t.gold} />
              ))}
            </View>
          </View>
        </Animated.View>
      ))}
    </ScrollView>
  );
}

export function Pillars() {
  const t = useTheme();
  const items: [keyof typeof MaterialCommunityIcons.glyphMap, string, string][] = [
    ['sprout', 'Source To Table', 'We work directly with our farmer families.'],
    ['pot-steam-outline', 'Time-Honored Techniques', 'Bilona, chakki and stone press. The old ways.'],
    ['water-check-outline', 'Unwavering Purity', 'Minimally processed. Lab tested.'],
    ['hand-heart-outline', 'Commitment to Community', 'Good for you, good for the planet.'],
  ];
  return (
    <View style={{ paddingHorizontal: 20 }}>
      <Txt v="h2">The Rosier Foods Experience</Txt>
      <Txt v="body" color={t.textSoft} style={{ marginBottom: 14 }}>
        असली स्वाद की एक सच्ची यात्रा
      </Txt>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
        {items.map(([icon, title, body]) => (
          <View key={title} style={{ width: '47.5%', backgroundColor: t.card, borderRadius: 18, padding: 14 }}>
            <View style={{ width: 40, height: 40, borderRadius: 12, backgroundColor: t.cardStrong, alignItems: 'center', justifyContent: 'center' }}>
              <MaterialCommunityIcons name={icon} size={22} color={t.primary} />
            </View>
            <Text style={{ fontFamily: fonts.serif, fontSize: 15, color: t.text, marginTop: 10 }}>{title}</Text>
            <Text style={{ fontFamily: fonts.sans, fontSize: 11.5, color: t.textSoft, marginTop: 4, lineHeight: 16 }}>{body}</Text>
          </View>
        ))}
      </View>
    </View>
  );
}
