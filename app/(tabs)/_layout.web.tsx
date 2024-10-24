import '@/components/gesture-handler';
import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';

import { useSession } from '../../ctx';
import { JsStack } from '@/layouts/js-stack';
export default function AppLayout() {
  const { userSession, loadingUser } = useSession();

  if (loadingUser) {
    return <Text>Loading...</Text>;
  }

  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!userSession) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    //return <Redirect href="/sign-in" />;
  }

//https://docs.expo.dev/router/advanced/stack/#relation-with-native-stack-navigator
  return <Stack>
      <Stack.Screen name="index" options={{ title: 'Home' }} />
      <Stack.Screen name="map" options={{ title: 'Map Title' }} />
      <Stack.Screen name="add" options={{ 
          title: 'Add an Artifact'
        }} />
       <Stack.Screen
        name="modal"
        options={{
          presentation: 'modal'
        }}
      />
  </Stack>;
}
