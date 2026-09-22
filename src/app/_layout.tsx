import { Brygada1918_400Regular } from '@expo-google-fonts/brygada-1918/400Regular';
import { Brygada1918_600SemiBold } from '@expo-google-fonts/brygada-1918/600SemiBold';
import { Brygada1918_700Bold } from '@expo-google-fonts/brygada-1918/700Bold';
import { Poppins_300Light } from '@expo-google-fonts/poppins/300Light';
import { Poppins_400Regular } from '@expo-google-fonts/poppins/400Regular';
import { Poppins_500Medium } from '@expo-google-fonts/poppins/500Medium';
import { Poppins_600SemiBold } from '@expo-google-fonts/poppins/600SemiBold';
import { Poppins_700Bold } from '@expo-google-fonts/poppins/700Bold';
import { useFonts } from 'expo-font';
import { SplashScreen } from 'expo-router';
import Stack from 'expo-router/stack';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect } from 'react';
import { View } from 'react-native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { FlyHost } from '../components/FlyToCart';
import { ToastHost } from '../components/Toast';
import { useBanners } from '../data/banners';
import { useCatalog } from '../data/catalog';
import { useApp } from '../store/app';
import { useCoins } from '../store/shop';
import { useTheme } from '../theme';

SplashScreen.preventAutoHideAsync().catch(() => {});

export default function RootLayout() {
  const [loaded] = useFonts({
    Brygada1918_400Regular,
    Brygada1918_600SemiBold,
    Brygada1918_700Bold,
    Poppins_300Light,
    Poppins_400Regular,
    Poppins_500Medium,
    Poppins_600SemiBold,
    Poppins_700Bold,
  });
  const hydrated = useApp((s) => s.hydrated);
  const t = useTheme();

  useEffect(() => {
    if (loaded && hydrated) SplashScreen.hideAsync().catch(() => {});
  }, [loaded, hydrated]);

  useEffect(() => {
    useCoins.getState().init();
    // Credit any coins whose waiting period is over, then fetch live prices.
    useCoins.getState().releasePending();
    useCatalog.getState().refresh();
    useBanners.getState().refresh();
  }, []);

  if (!loaded || !hydrated) return <View style={{ flex: 1, backgroundColor: '#FBEBD8' }} />;

  return (
    <GestureHandlerRootView style={{ flex: 1, backgroundColor: t.bg }}>
      <SafeAreaProvider>
        <StatusBar style={t.mode === 'dark' ? 'light' : 'dark'} />
        <Stack screenOptions={{ headerShown: false, contentStyle: { backgroundColor: t.bg }, animation: 'slide_from_right' }}>
          <Stack.Screen name="index" options={{ animation: 'none' }} />
          <Stack.Screen name="onboarding" options={{ animation: 'fade' }} />
          <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
          <Stack.Screen name="product/[handle]" options={{ animation: 'fade_from_bottom' }} />
          <Stack.Screen name="search" options={{ animation: 'fade' }} />
        </Stack>
        <FlyHost />
        <ToastHost />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
