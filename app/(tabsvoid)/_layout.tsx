import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs>
      <Tabs.Screen name="index" options={{ title: 'Home-tabs' }} />
      <Tabs.Screen name="login" options={{ title: 'Login-tabs' }} />
    </Tabs>
  );
}