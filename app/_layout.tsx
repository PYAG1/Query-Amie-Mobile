import {
  Montserrat_100Thin,
  Montserrat_100Thin_Italic,
  Montserrat_200ExtraLight,
  Montserrat_200ExtraLight_Italic,
  Montserrat_300Light,
  Montserrat_300Light_Italic,
  Montserrat_400Regular,
  Montserrat_400Regular_Italic,
  Montserrat_500Medium,
  Montserrat_500Medium_Italic,
  Montserrat_600SemiBold,
  Montserrat_600SemiBold_Italic,
  Montserrat_700Bold,
  Montserrat_700Bold_Italic,
  Montserrat_800ExtraBold,
  Montserrat_800ExtraBold_Italic,
  Montserrat_900Black,
  Montserrat_900Black_Italic,
} from '@expo-google-fonts/montserrat';
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import defaultConfig from '@tamagui/config/v3';
import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect } from 'react';
import 'react-native-reanimated';
import Toast from 'react-native-toast-message';
import { createTamagui, TamaguiProvider } from 'tamagui';


const config = createTamagui(defaultConfig)

import { useColorScheme } from '@/hooks/useColorScheme';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const colorScheme = useColorScheme();
  let [loaded] = useFonts({
    Montserrat_100Thin,
    Montserrat_200ExtraLight,
    Montserrat_300Light,
    Montserrat_400Regular,
    Montserrat_500Medium,
    Montserrat_600SemiBold,
    Montserrat_700Bold,
    Montserrat_800ExtraBold,
    Montserrat_900Black,
    Montserrat_100Thin_Italic,
    Montserrat_200ExtraLight_Italic,
    Montserrat_300Light_Italic,
    Montserrat_400Regular_Italic,
    Montserrat_500Medium_Italic,
    Montserrat_600SemiBold_Italic,
    Montserrat_700Bold_Italic,
    Montserrat_800ExtraBold_Italic,
    Montserrat_900Black_Italic,
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }
  const queryClient = new QueryClient()
  return (
<QueryClientProvider client={queryClient}>
<ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme} >
        <TamaguiProvider config={config}>
      <Stack initialRouteName='(drawer)'>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="index"  options={{ headerShown: false }}  />
        <Stack.Screen name="auth/signin/index"  options={{ headerShown: false }}  />
        <Stack.Screen name="auth/signup/index"  options={{ headerShown: false }}  />
        <Stack.Screen name="main/index"  options={{ headerShown: false }}  />
        <Stack.Screen name="chat/index"  options={{ headerShown: false }}  />
        <Stack.Screen name="(drawer)"  options={{ headerShown: false }}  />
      </Stack>
      <Toast />
      </TamaguiProvider>
    </ThemeProvider>
</QueryClientProvider>
  );
}
