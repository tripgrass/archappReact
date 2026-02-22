import React, { useEffect, useState } from 'react';
import {FlatList, Image, ImageBackground, Platform, Pressable, View, Text,TouchableOpacity  } from 'react-native';
import CustomButton from '@/components/Button';

import { useSession } from '@/utilities/AuthContext';
import { Redirect } from 'expo-router';
import { NavigationContainer, useNavigation, useRoute } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import map  from '@/app/(tabs)/map';
import camera  from '@/app/(tabs)/camera';
import AddTab from '@/app/(tabs)/artifacts/add';
import EditArtifact from '@/app/(tabs)/artifacts/edit';
import show from '@/app/(tabs)/artifacts/show';
import showCollection from '@/app/(tabs)/collections/show';
import Compare from '@/app/(tabs)/artifacts/compare';
import AddCollection from '@/app/(tabs)/collections/add';
import EditCollection from '@/app/(tabs)/collections/edit';
import home from '@/app/(tabs)/index';
import ProfilePage from '@/app/(tabs)/profile';
import Home from '@/app/(tabs)/home';
import artifacts from '@/app/(tabs)/artifacts';
import SignIn from '@/app/sign-in';
import Register from '@/app/register';
import settings from '@/app/(tabs)/settings';
import CollectionsPage from '@/app/(tabs)/collections';
import { Tabs } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import Icon from 'react-native-vector-icons/Ionicons';
import {setItem, getItem, getAllKeys} from '@/utilities/AsyncStorage';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Link } from 'expo-router';
import * as Linking from 'expo-linking';
import { useNavigationState } from '@react-navigation/native';
import  {ArtifactsService}  from '@/utilities/ArtifactsService';
import  {CollectionsService}  from '@/utilities/CollectionsService';
import Constants from 'expo-constants';
import { Asset, useAssets } from 'expo-asset';

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



const Drawer = createDrawerNavigator();
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function MyTabs() {
  const { userSession, signOut } = useSession();	
	const [artifacts, setArtifacts] = useState([]); 
	const [artifactId, setArtifactId] = useState([]); 
	const [artifactsList, setArtifactsList] = useState([]); 
	const [artifactsCompareList, setArtifactsCompareList] = useState([]); 
	const [collections, setCollections] = useState([]); 
	const [ tempId, setTempId] = useState( );
	const [ collectionId, setCollectionId] = useState( null );

	const navigationState = useNavigationState((state) => state);
	const getNestedRouteName = (state: any): string | null => {
	    if (!state) return null;

	    const route = state.routes[state.index];
	    if (route.state) {
			return getNestedRouteName(route.state);
	    }
	    return route.name;
	};	
	function createArtifactId(){
		var form = new FormData();
		form.append('idOnly', true);
		console.log('create from scratch:');
		console.log('create form:' , form);
		ArtifactsService({
			method:'create',
			url:'artifacts',
			data:form
		}).then( (results) => {
			console.log('ADD FILE ::::::::::::::::::after submit results no web', results);
			var newArtifact = results;
			setTempId( newArtifact.id );
		}).catch((error) => {
			console.log('saving error:',error);
		})				
	}	
	useEffect(() => {
//    console.log('useffect in layout:::::::');
//if(userSession){
    	console.log('99 ----------------------------------');
    	if( !tempId ){
	    	console.log('101 ----------------------------------');
        	createArtifactId();
        }
	}, [userSession]);
	useEffect(() => {
    	console.log('107 ----------------------------------');
    	console.log(' ----------------------------------');
    	console.log(' ----------------------------------');

		ArtifactsService({
			method:'getAll'
		}).then( (results) => {

			//console.log('RESULTS OF getall',  results)
			const artifactsList = {};
			const artifactsCompareList = {};
			//console.log('artifactsList start', artifactsList);
			Object.keys(results).forEach((k, i) => {
				artifactsList[results[i].id] = results[i];
				if( results[i].images.length > 0 ){
					artifactsCompareList[results[i].id] = results[i];
				}
			});
			setArtifacts(results);
			setArtifactsList(results);
			setArtifactsCompareList(artifactsCompareList);
		}).catch(
			(error) => console.log('in profile getall .error', error)
		)

		CollectionsService({
			method:'getAll'
		}).then( (results) => {
console.log('RESULTS OF getall collections',  results)
			setCollections(results)
		}).catch(
			(error) => console.log('in layout collections getall .error', error)
		)

//}
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
						size = 15;
					} else if (route.name === 'Add') {
						iconName = focused ? 'add-circle' : 'add-circle-outline';
						size = 35;
					} else if (route.name === 'ProfileTab' || route.name === 'SignIn' || route.name === 'Register') {
						iconName = focused ? 'person' : 'person-outline';
						size = 15;
					}          
					return <Ionicons name={iconName} size={size} color={color} />;
				}, 
				tabBarShowLabel:false,
				tabBarButton: (props) => {
					if (route.name != 'show' && route.name != 'showCollection' && route.name != 'compare' && route.name != 'edit' && route.name != 'EditCollection' && route.name != 'AddCollection') {
						return <TouchableOpacity  {...props} />
					}
				},
				tabBarHideOnKeyboard: true,
				tabBarIconStyle: {
	                flex: 1,
	                alignItems: 'center',
	                justifyContent: 'center',
	                marginBottom: 0,
	            },
	            tabBarItemStyle:{
					display: ( route.name === 'Home' || route.name === 'Add' || ( userSession && route.name === 'ProfileTab' )  || ( !userSession && route.name === 'Register') ) ? 'flex' : 'none',
      			},
				tabBarStyle: {
					width:'100%',
					textAlign:'center',
					display: hideTabBarScreens.includes(currentRouteName) ? 'none' : 'flex',
				},			    
			})}

		>
			<Tab.Screen name="Home"  					
				children={()=>{
						return(
							<Home  initialParams={{
									artifacts:artifacts, collections:collections, artifactId:artifactId, setArtifactId:setArtifactId
								}}/>
						)
					}}
   				options={{
         		headerShown: false,
       		}}
			/>
			{ ( userSession ) ? (			
			<Tab.Screen name="Add" 
				children={()=>{
							return(
								<AddTab  tempId={tempId} artifacts={artifacts} setArtifacts={setArtifacts} setTempId={setTempId}/>
							)
						}} 

					options={{
	         		headerShown: false,
	       		}}
			/>
			) : (null) }
				<Tab.Screen name="SignIn" tempId={tempId} options={{ title: 'signIn' }} component={SignIn}/>
				<Tab.Screen name="Register" options={{ title: 'Artifix' }} component={Register}/>

			{ ( userSession ) ? (			

				<Tab.Screen name="ProfileTab" 
						children={()=>{
							return(
								<ProfilesTab  initialParams={{
										artifacts:artifacts, setArtifacts:setArtifacts, 
										tempId:tempId, 
										collections:collections, setCollections:setCollections, collectionId:collectionId, setCollectionId:setCollectionId,
										artifactId:artifactId,
										setArtifactId:setArtifactId
									}}/>
							)
						}}
	   				options={{
	         		headerShown: false,
	       		}}
				/>
			) : (null ) }			
			<Tab.Screen name="AddCollection" 
			children={()=>{
						return(
							<AddCollection  tempId={tempId} artifacts={artifacts} setArtifacts={setArtifacts} setTempId={setTempId}/>
						)
					}} 

				options={{
         		headerShown: false,
       		}}
			/>

			<Tab.Screen name="edit" options={{ title: 'Editing', headerShown: false }} 			children={()=>{
						return(
							<EditArtifact tempId={tempId} setTempId={setTempId}  artifactId={artifactId} collectionId={collectionId} setCollectionId={setCollectionId} initialParams={{ artifactsList:artifactsList}}/>
						)}}
 />
			<Tab.Screen name="EditCollection" options={{ title: 'Editing', headerShown: false }} 
			children={()=>{
						return(
							<EditCollection collectionId={collectionId} initialParams={{artifacts:artifacts, artifactsList:artifactsList}}/>
						)}}
					/>

			<Tab.Screen 
				name="show" 
				options={{
	          		headerShown: false,
				}} 
				component={show}
			/>
			<Tab.Screen 
				name="showCollection" 
				options={{
	          		headerShown: false,

				}} 
				component={showCollection}
			/>			

			<Tab.Screen 
				name="compare" 
				children={()=>{
						return(
							<Compare
								artifactId={artifactId}
								artifacts={artifacts}
								artifactsCompareList={artifactsCompareList}
							/>
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
	const { userSession, signOut } = useSession();
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
			<DrawerItem
				label="Sign Out"
				onPress={() => {
                  signOut();
                }} 
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
							<ProfilePage artifacts={data.initialParams.artifacts} setArtifacts={data.initialParams.setArtifacts} artifactId={data.initialParams.artifactId} setArtifactId={data.initialParams.setArtifactId}/>
						)
					}} />
			<Drawer.Screen name="Collections" children={()=>{
						return(
							<CollectionsPage artifacts={data.initialParams.artifacts} setArtifactId={data.initialParams.setArtifactId} setArtifacts={data.initialParams.setArtifacts} 
							collections={data.initialParams.collections} setCollections={data.initialParams.setCollections}
							collectionId={data.initialParams.collectionId} setCollectionId={data.initialParams.setCollectionId}
							/>
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
	    //fillLocationModeVal = await AsyncStorage.getItem('fillLocationMode');
	    //setFillLocationMode(fillLocationModeVal);
			//console.log('fillLocationMode',fillLocationModeVal);

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
				<Stack.Screen name="add" options={{ title: 'ddd' }} component={EditArtifact} />
			</Stack.Navigator>
	);
}

export default App;
