import { Stack } from 'expo-router';

export default function GamePlanLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="today" />
      <Stack.Screen name="drill/[id]" />
    </Stack>
  );
}
