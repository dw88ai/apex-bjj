import { Stack } from 'expo-router';

export default function TrainingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="pre-session" />
      <Stack.Screen name="post-session" />
    </Stack>
  );
}
