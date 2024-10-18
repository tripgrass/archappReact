import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
screenOptions={{
        headerStyle: {
          backgroundColor: '#f4511e',
        },
        headerShown: false,
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}    
    >
      <Tabs.Screen name="index" options={{ title: 'Home-tabs-web' }} />
      <Tabs.Screen name="login" options={{ title: 'Login-tabs-web' }} />
    </Tabs>
  );
}