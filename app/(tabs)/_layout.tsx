import React, { useEffect, useState } from 'react';
import { Platform, Pressable, View, Text,TouchableOpacity  } from 'react-native';
import CustomButton from '@/components/Button';

import { useSession } from '@/utilities/AuthContext';
import { Redirect } from 'expo-router';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import map  from '@/app/(tabs)/map';
import camera  from '@/app/(tabs)/camera';
import AddTab from '@/app/(tabs)/artifacts/add';
import edit from '@/app/(tabs)/artifacts/edit';
import show from '@/app/(tabs)/artifacts/show';
import home from '@/app/(tabs)/index';
import ProfilePage from '@/app/(tabs)/profile';
import artifacts from '@/app/(tabs)/artifacts';
import SignIn from '@/app/sign-in';
import Register from '@/app/register';
import settings from '@/app/(tabs)/settings';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';
import {setItem, getItem, getAllKeys} from '@/utilities/AsyncStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import * as Linking from 'expo-linking';
import { useNavigationState } from '@react-navigation/native';
import  {ArtifactsService}  from '@/utilities/ArtifactsService';

import {
	createDrawerNavigator,
	DrawerContentScrollView,
	DrawerItemList,
	DrawerItem,
	DrawerToggleButton
} from '@react-navigation/drawer';



function EmptyScreen() {
	return <View />;
}


function Home({ navigation }) {

  const { userSession, signOut } = useSession();
//  console.log('home userSession', userSession);
	return (
		<View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
			<Text>Home Screens </Text>

			<View style={{height:40}}></View>

			<CustomButton  title="Drawer?" onPress={() => navigation.navigate('ProfileTab')} />
	
			<CustomButton title="Edit" onPress={() => navigation.navigate('/artifacts/edit')} />

			<CustomButton title="Go to Map" onPress={() => navigation.navigate('map')} />
			<CustomButton title="Camera" onPress={() => navigation.navigate('camera')} />
			{ (userSession) ? (

				<CustomButton title="Sign Out" 
					style={{margin:20}}
	            onPress={() => {
	              // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
	              signOut();
	            }} />
	           ) : <CustomButton title="Sign In" 
					style={{margin:20}}
	            onPress={() => navigation.navigate('SignIn')} />
         }

		</View>
	);
}

const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  const { userSession, signOut } = useSession();	
	const [artifacts, setArtifacts] = useState([]); 

	const navigationState = useNavigationState((state) => state);
	const getNestedRouteName = (state: any): string | null => {
	    if (!state) return null;

	    const route = state.routes[state.index];
	    if (route.state) {
			return getNestedRouteName(route.state);
	    }
	    return route.name;
	};
	useEffect(() => {
    console.log('useffect in profile tab');
        { (userSession) ? (

            ArtifactsService({method:'getAll'})
                .then( (results) => {

                console.log('RESULTS OF getall',  results)
                    setArtifacts(results)
                })
                .catch((error) => console.log('in profile getall .error', error))
            ) : null }
   }, []);
	const currentRouteName = getNestedRouteName(navigationState);
	const hideTabBarScreens = ['Add', 'edit'];

	return (
		<Tab.Navigator
			screenOptions={({ route }) => ({
				tabBarIcon: ({ focused, color, size }) => {
					let iconName;
					if (route.name === 'Home') {
						iconName = focused ? 'home' : 'home-outline';
						size = 20;
					} else if (route.name === 'Add') {
						iconName = focused ? 'add-circle' : 'add-circle-outline';
						size = 40;
					} else if (route.name === 'ProfileTab') {
						iconName = focused ? 'person' : 'person-outline';
						size = 20;
					}          
					return <Ionicons name={iconName} size={size} color={color} />;
				}, 
				tabBarShowLabel:false,
				tabBarButton: (props) => {
					if (route.name != 'show' && route.name != 'edit') {
						return <TouchableOpacity  {...props} />
					}
				},
			    tabBarHideOnKeyboard: true,
				tabBarStyle: {
					display: hideTabBarScreens.includes(currentRouteName) ? 'none' : 'flex',
				},			    
			})}

		>
			<Tab.Screen name="Home" component={Home} 					
				options={{
         		headerShown: false,
       		}}
			/>
			<Tab.Screen name="Add" 
			children={()=>{
						return(
							<AddTab  initialParams={{artifacts:artifacts, setArtifacts:setArtifacts}}/>
						)
					}} 

				options={{
         		headerShown: false,
       		}}
			/>
			<Tab.Screen name="edit" options={{ title: 'Editing', headerShown: false }} component={edit} />

			<Tab.Screen 
				name="show" 
				options={{
	          		headerShown: false,
				}} 
				component={show}
			/>

			<Tab.Screen name="ProfileTab" 
					children={()=>{
						return(
							<ProfilesTab  initialParams={{artifacts:artifacts, setArtifacts:setArtifacts}}/>
						)
					}}
   				options={{
         		headerShown: false,
       		}}
			/>
		</Tab.Navigator>
	);
}
function CustomDrawerContent(props) {
	return (
		<DrawerContentScrollView {...props}>
			<DrawerItemList {...props} />
			<DrawerItem
				label="Close drawer"
				onPress={() => props.navigation.closeDrawer()}
			/>
			<DrawerItem
				label="Toggle drawer"
				onPress={() => props.navigation.toggleDrawer()}
			/>
		</DrawerContentScrollView>
	);
}


function CustomDrawerToggleButton({ tintColor, ...rest }: Props) {
  const navigation = useNavigation<DrawerNavigationProp<ParamListBase>>();

  return (
    <Pressable
      {...rest}
      accessible
      accessibilityRole="button"
      android_ripple={{ borderless: true }}
      onPress={() => navigation.toggleDrawer()}
      style={{marginHorizontal: 11}}
      hitSlop={Platform.select({
        ios: undefined,
        default: { top: 16, right: 16, bottom: 16, left: 16 },
      })}
    >
      <Ionicons name="settings-outline" size={22} color="" style={{
			display:'block',height: 24,
			width: 24,
			margin: 3,
			resizeMode: 'contain'
			}} />
    </Pressable>
  );
}
function ProfilesTab( data ) {
	console.log('profiles data ', data.initialParams);
	return (
		<Drawer.Navigator drawerContent={(props) => <CustomDrawerContent {...props} />}
			screenOptions={{
				drawerPosition: 'right',
				headerLeft: false,
				headerRight: () => <CustomDrawerToggleButton />,


			}}

		>
			<Drawer.Screen name="Profile" children={()=>{
						return(
							<ProfilePage artifacts={data.initialParams.artifacts} setArtifacts={data.initialParams.setArtifacts}/>
						)
					}} />
			<Drawer.Screen name="Settings" component={settings} />
			<Drawer.Screen name="Your Artifacts" component={artifacts} />
		</Drawer.Navigator>
	);
}

function App() {
	const { userSession, loadingUser } = useSession();
	const [keys, setKeys] = useState([]);
	const [fillLocationMode, setFillLocationMode] = useState([]);

	useEffect( () => {
		const getData = async () => {
	    fillLocationModeVal = await AsyncStorage.getItem('fillLocationMode');
	    setFillLocationMode(fillLocationModeVal);
			console.log('fillLocationMode',fillLocationModeVal);

	  };

	  getData();  

	}, [] )

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
	return (
		<NavigationContainer independent={true}>
			<Stack.Navigator 

			>
				<Stack.Screen name="Artifix" 
					component={MyTabs} 
					options={{
            			headerShown: false,
          			}}
          							// has a nested Tab Navigator
				/>
				<Stack.Screen name="ProfileTab" component={ProfilesTab} 
					options={{
            		headerShown: false,
          		}}
          	/>
				<Stack.Screen name="Home" options={{ title: 'Map Title' }} component={Home}/>
				<Stack.Screen name="SignIn" options={{ title: 'SignIn' }} component={SignIn}/>
				<Stack.Screen name="Register" options={{ title: 'Register' }} component={Register}/>
				
				<Stack.Screen name="map" options={{ title: 'Map Title' }} component={map}/>
				<Stack.Screen name="camera" options={{ title: 'Camera' }} component={camera}/>
				<Stack.Screen name="add" options={{ title: 'ddd' }} component={edit} />
			</Stack.Navigator>
		</NavigationContainer>
	);
}

export default App;
