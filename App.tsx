import React, { useEffect } from 'react';
import { View, Text, TextInput, StyleSheet, Platform, ActivityIndicator } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import * as SplashScreen from 'expo-splash-screen';
import {
  useFonts,
  Nunito_400Regular,
  Nunito_600SemiBold,
  Nunito_700Bold,
  Nunito_800ExtraBold,
} from '@expo-google-fonts/nunito';
import {
  DMSans_400Regular,
  DMSans_500Medium,
  DMSans_600SemiBold,
  DMSans_700Bold,
} from '@expo-google-fonts/dm-sans';
import { ThemeProvider, C } from './src/theme';
import { RootNavigator } from './src/navigation/RootNavigator';
import { ToastProvider } from './src/components/ui/Toast';
import { useAuthBootstrap } from './src/hooks/useAuthBootstrap';

// Cap font scaling for accessibility without breaking layout.
if ((Text as any).defaultProps == null) (Text as any).defaultProps = {};
(Text as any).defaultProps.maxFontSizeMultiplier = 1.5;
if ((TextInput as any).defaultProps == null) (TextInput as any).defaultProps = {};
(TextInput as any).defaultProps.maxFontSizeMultiplier = 1.5;

if (Platform.OS !== 'web') {
  SplashScreen.preventAutoHideAsync().catch(() => {});
}

export default function App() {
  const [fontsLoaded, fontError] = useFonts({
    Nunito_400Regular,
    Nunito_600SemiBold,
    Nunito_700Bold,
    Nunito_800ExtraBold,
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_600SemiBold,
    DMSans_700Bold,
  });

  const { ready: authReady } = useAuthBootstrap();
  const fontsReady =
    Platform.OS === 'web' ? true : fontsLoaded || !!fontError;
  // Wait for both the fonts AND the persisted Supabase session restore
  // before mounting the navigator. Otherwise a signed-in user would flash
  // the Welcome screen for ~100ms while getSession() resolves.
  const ready = fontsReady && authReady;

  useEffect(() => {
    if (!ready || Platform.OS === 'web') return;
    SplashScreen.hideAsync().catch(() => {});
  }, [ready]);

  if (!ready) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator size="large" color={C.pink} />
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <ThemeProvider>
          <ToastProvider>
            <NavigationContainer>
              <RootNavigator />
            </NavigationContainer>
            <StatusBar style="dark" />
          </ToastProvider>
        </ThemeProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    ...(Platform.OS === 'web' ? { minHeight: '100vh' as unknown as number } : {}),
  },
  loading: {
    flex: 1,
    backgroundColor: C.bg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
