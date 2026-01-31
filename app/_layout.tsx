import { Stack } from 'expo-router';
import { PaperProvider } from 'react-native-paper';
import { AppProvider } from '../context/AppContext';
import { theme } from '../constants/theme';
import { StatusBar } from 'expo-status-bar';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useFonts, DMSans_400Regular, DMSans_500Medium, DMSans_700Bold } from '@expo-google-fonts/dm-sans';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { Text } from 'react-native-paper';
import { Colors } from '../constants/colors';

export default function RootLayout() {
  const [fontsLoaded, fontError] = useFonts({
    DMSans_400Regular,
    DMSans_500Medium,
    DMSans_700Bold,
  });

  if (!fontsLoaded && !fontError) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={styles.loadingText}>Loading Apex BJJ...</Text>
      </View>
    );
  }

  return (
    <ErrorBoundary>
      <AppProvider>
        <PaperProvider theme={theme}>
          <StatusBar style="light" />
          <View style={styles.responsiveContainer}>
            <View style={styles.contentContainer}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="index" />
                <Stack.Screen name="(auth)" />
                <Stack.Screen name="(tabs)" />
                <Stack.Screen name="training" />
                <Stack.Screen name="review" />
                <Stack.Screen name="battlecards" />
                <Stack.Screen name="mission-complete" />
                <Stack.Screen name="seed" />
              </Stack>
            </View>
          </View>
        </PaperProvider>
      </AppProvider>
    </ErrorBoundary>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
    gap: 16,
  },
  loadingText: {
    color: Colors.textSecondary,
    fontSize: 16,
  },
  responsiveContainer: {
    flex: 1,
    backgroundColor: '#000000', // Root background for desktop margins
    alignItems: 'center', // Center content horizontally
  },
  contentContainer: {
    flex: 1,
    width: '100%',
    maxWidth: 600, // Limit width on large screens
    backgroundColor: Colors.background,
  },
});
