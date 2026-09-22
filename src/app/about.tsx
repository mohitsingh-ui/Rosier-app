import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Pillars } from '../components/HomeExtras';
import { Button, ScreenHeader, Txt } from '../components/ui';
import { openStorePage } from '../lib/cart';
import { fonts, useTheme } from '../theme';

const Para = ({ children, delay = 0 }: { children: string; delay?: number }) => {
  const t = useTheme();
  return (
    <Animated.Text entering={FadeInDown.delay(delay)} style={{ fontFamily: fonts.sans, fontSize: 15, color: t.textSoft, lineHeight: 24, marginTop: 10 }}>
      {children}
    </Animated.Text>
  );
};

export default function About() {
  const t = useTheme();
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScreenHeader title="Our Story" />
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <LinearGradient colors={[t.header, t.bg]} style={{ padding: 20, paddingTop: 10 }}>
          <Animated.Text entering={FadeInDown.springify()} style={{ fontFamily: fonts.serifBold, fontSize: 32, color: t.heading, lineHeight: 38 }}>
            We are reviving the traditional ways of Old Bharat
          </Animated.Text>
          <Para delay={100}>
            We believe the wisdom of Old Bharat still holds the secret to wholesome living. Age-old recipes, natural cooking methods and ingredients trusted by generations, made with modern quality standards.
          </Para>
        </LinearGradient>

        <View style={{ paddingHorizontal: 20 }}>
          <Txt v="h2" style={{ marginTop: 10 }}>
            How it started
          </Txt>
          <Para>
            Our journey began with a simple belief: good food brings people together. A passion for wholesome, authentic flavours grew into a mission to make food that's nourishing, sustainable and crafted with care.
          </Para>
          <Para>
            We work closely with farmer families and suppliers who share our values. Every product balances traditional recipes with modern sensibilities, so every bite is rich in taste and goodness.
          </Para>

          <Animated.View entering={FadeInDown.delay(200)} style={{ marginTop: 24, backgroundColor: t.card, borderRadius: 22, padding: 18 }}>
            <MaterialCommunityIcons name="format-quote-open" size={30} color={t.gold} />
            <Txt v="h3" style={{ marginTop: 4 }}>
              A note from our founder
            </Txt>
            <Para>
              Gaurav has spent over 20 years in health and fitness, and has always been fascinated by the wisdom of ancient Indian sciences. He started Rosier to bring those traditions back to modern kitchens, beginning with milk from indigenous Gir cows.
            </Para>
            <Text style={{ fontFamily: fonts.serif, fontSize: 16, color: t.heading, marginTop: 12 }}>— Gaurav, Founder</Text>
          </Animated.View>

          <Txt v="h2" style={{ marginTop: 28 }}>
            Sustainability
          </Txt>
          <Para>
            Our products are minimally processed from consciously sourced ingredients. The healthy choices you make for your body should be healthy for the planet too.
          </Para>
        </View>

        <View style={{ marginTop: 28 }}>
          <Pillars />
        </View>

        <View style={{ paddingHorizontal: 20, marginTop: 24, gap: 10 }}>
          <Button label="See our lab reports" icon="flask-outline" kind="dark" onPress={() => openStorePage('/pages/lab-test-reports')} />
          <Button label="Visit rosierfoods.com" kind="ghost" onPress={() => openStorePage('/pages/about-us')} />
        </View>
      </ScrollView>
    </View>
  );
}
