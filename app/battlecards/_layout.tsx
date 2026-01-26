import { Stack } from 'expo-router';
import { Colors } from '../../constants/colors';

export default function BattleCardsLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {
          backgroundColor: Colors.surface,
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontWeight: 'bold',
        },
        headerShadowVisible: false,
      }}
    >
      <Stack.Screen
        name="[system]"
        options={{
          title: 'Battle Card',
          headerBackTitle: 'Systems',
        }}
      />
      <Stack.Screen
        name="finish/[type]"
        options={{
          title: 'Finish',
          headerBackTitle: 'Back',
          presentation: 'modal',
        }}
      />
    </Stack>
  );
}
