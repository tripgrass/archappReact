import { Text } from 'react-native';
import { Redirect, Stack } from 'expo-router';

import { useSession } from '../../ctx';

export default function AppLayout() {
  const { machineSession } = useSession();

  // You can keep the splash screen open, or render a loading screen like we do here.
console.log('machineSession', machineSession);
  // Only require authentication within the (app) group's layout as users
  // need to be able to access the (auth) group and sign in again.
  if (!machineSession) {
    // On web, static rendering will stop here as the user is not authenticated
    // in the headless Node process that the pages are rendered in.
    return <Redirect href="/sign-in" />;
  }

  // This layout can be deferred because it's not the root layout.
  return <Stack />;
}
