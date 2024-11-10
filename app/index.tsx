import { View, Pressable, Text } from 'react-native';
import { Link, Redirect } from 'expo-router';
import { useSession } from '../ctx';
import { useStorageState } from '../useStorageState';
import {GetLaravelUserAuthentication} from '@/components/GetLaravelUserAuthentication';

const s = require('@/components/style');

export default function Page() {
  const [[isLoading, machineSession], setMachineSession] = useStorageState('machineSession');
  const { userSession, signOut } = useSession();

   return <Redirect href="/(tabs)" />;
 
   return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Landing Page</Text>
      {machineSession ? (
        <Text>hasmachineauth</Text>
      ) : (
        <Text>checking for auth</Text>
      ) }
          <Link href="/(tabs)/map" asChild >
            <Pressable >
              <Text style={s.link}>Map</Text>
            </Pressable>
          </Link>
      {userSession ? (
        <>
          <Link href="/(tabs)/index" asChild >
            <Pressable >
              <Text style={s.link}>home</Text>
            </Pressable>
          </Link>
          <Link href="/(tabs)/map" asChild >
            <Pressable >
              <Text style={s.link}>Map</Text>
            </Pressable>
          </Link>
          <Link href="/(tabs)/add" asChild >
            <Pressable >
              <Text style={s.link}>Add Artifact</Text>
            </Pressable>
          </Link>
          <Text
            style={s.button}
            onPress={() => {
              // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
              signOut();
            }}>
            Sign Out
          </Text>              
        </>
      )   : (
      <Link href="/sign-in" asChild >
        <Pressable >
          <Text style={s.button}>Sign In</Text>
        </Pressable>
      </Link>
      )
      }
      

    </View>
  );
}
