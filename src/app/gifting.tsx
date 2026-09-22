import { MaterialCommunityIcons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Linking, Text, View } from 'react-native';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { ProductGrid } from '../components/ProductGrid';
import { Button, ScreenHeader } from '../components/ui';
import { useProducts } from '../data/catalog';
import { fonts, useTheme } from '../theme';

export default function Gifting() {
  const t = useTheme();
  const combos = useProducts().filter((p) => p.category === 'combos');
  return (
    <View style={{ flex: 1, backgroundColor: t.bg }}>
      <ScreenHeader title="Gifting" />
      <ProductGrid
        products={combos}
        showCategories={false}
        bottomPad={40}
        header={
          <Animated.View entering={FadeInDown.springify()} style={{ marginHorizontal: 16, marginBottom: 10 }}>
            <LinearGradient colors={['#4A2C17', '#8C552E']} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ borderRadius: 22, padding: 18 }}>
              <MaterialCommunityIcons name="gift-outline" size={36} color="#E8C27A" />
              <Text style={{ fontFamily: fonts.serif, fontSize: 24, color: '#FFF5E8', marginTop: 6 }}>Gift something real</Text>
              <Text style={{ fontFamily: fonts.sans, fontSize: 13, color: '#E9D6C0', marginTop: 4 }}>
                Our combos make thoughtful gifts for family, friends and teams. Ordering for your company?
              </Text>
              <Button
                small
                kind="gold"
                label="Corporate gifting enquiry"
                icon="mail-outline"
                style={{ alignSelf: 'flex-start', marginTop: 14 }}
                onPress={() => Linking.openURL('mailto:care@rosierfoods.com?subject=Corporate%20gifting%20enquiry')}
              />
            </LinearGradient>
          </Animated.View>
        }
      />
    </View>
  );
}
