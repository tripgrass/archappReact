import { View, Button, Pressable, Text } from 'react-native';
import { Link } from 'expo-router';
import { useSession } from '@/utilities/AuthContext';
import { useStorageState } from '../../useStorageState';
import {GetLaravelUserAuthentication} from '@/components/GetLaravelUserAuthentication';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

const s = require('@/components/style');

export default function Page({navigation}) {
  const [[isLoading, machineSession], setMachineSession] = useStorageState('machineSession');
  const { userSession, signOut } = useSession();


   return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Landing Page for tabs</Text>
      {machineSession ? (
        <Text>hasmachineauth</Text>
      ) : (
        <Text>checking for authsss</Text>
      ) }
      {userSession ? (
        <>
        <Link 
          style={{backgroundColor:'blue', margin:20, fontSize:24, padding:10}}
          href="/map">item.name
          </Link> 
          <Button title="Go to Map" onPress={() => navigation.navigate('map')} />
          <Link href="/(tabs)/map" asChild >
            <Pressable >
              <Text style={s.link}>Map</Text>
            </Pressable>
          </Link>
<Pressable
       style={s.button}
       onPress={() => navigation.toggleDrawer()}>
<Text>Toogle Side Nav</Text>
</Pressable>          
          <Link href="/(tabs)/artifacts/edit" asChild >
            <Pressable >
              <Text style={s.link}>edit Artifact</Text>
            </Pressable>
          </Link>
          <Link href="/(tabs)/artifacts/add" asChild >
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
