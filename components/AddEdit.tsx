import axios from 'axios';
import {Alert, FlatList, Image, ImageBackground, Input, Keyboard, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import {ArtifactsService}  from '@/utilities/ArtifactsService';
import { Asset } from 'expo-asset';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {CameraView, CameraType, useCameraPermissions} from 'expo-camera';
import Compressor from 'compressorjs';
import CustomButton from '@/components/Button';
import FilePicker from '@/components/FilePicker';
import FormData from 'form-data';
import ImageMeta from '@/components/ImageMeta';
import Ionicons from '@expo/vector-icons/Ionicons';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import React, { useState, useEffect, useRef } from 'react'
import { router, Link,useFocusEffect, useNavigation } from 'expo-router';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import {StatusBar} from 'expo-status-bar'
import { useForm, Controller } from 'react-hook-form';
import { useNavigationState } from '@react-navigation/native';
import { useSession } from '@/utilities/AuthContext';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import * as Location from "expo-location";
import CameraWrapper  from '@/app/(tabs)/camera';
import _ from "lodash";
import { useIsFocused } from '@react-navigation/native'

import Constants from 'expo-constants';

const s = require('@/components/style');

let camera: CameraView

export default function AddEdit( {navigation, id_dela_artifact} ) {
console.log('addedit artifactId', id_dela_artifact);
	const isEdit = id_dela_artifact ? true : false;
	const isFocused = useIsFocused()
	const [origImageIds, setOrigImageIds] = useState({});	
	const [artifactId, setArtifactId] = useState(id_dela_artifact ? id_dela_artifact : null);	
	const [artifact, setArtifact] = useState(null);	
	const [artifacts, setArtifacts] = useState([]);
	const [galleryImages, setGalleryImages] = useState({});
	const formFields = {
		id:null,
		name : null,
		title: null,
		address:null,
		city:null,
		state:null,
		zipcode:null
	};
	var artifactImages = [];
	const imageBaseUrl = "https://zkd.b51.mytemp.website/images/";
	
	const pageTitle = null;//!artifact ? 'Add an Artifact' : 'Edit ' + artifact.name;

	var artifact_id = artifactId ? artifactId : null;
	var defaultValues = {};
	const { register, setError, getValues, setValue, handleSubmit, control, reset, formState: { errors } } = useForm({
		defaultValues: defaultValues
	});

	function setup(artifact){

console.log('ARTOFACT as artifact', artifact);
//				setValue('latitude', JSON.stringify(latitude) );
		setScale(artifact.scale);
		defaultValues = {};
		Object.keys(formFields).forEach((k, i) => {
			defaultValues[k] = artifact[k];
		});
		defaultValues.latitude = JSON.stringify(artifact?.latitude);
		defaultValues.longitude = JSON.stringify(artifact?.longitude);
		if('undefined' != typeof artifact && 'undefined' != typeof artifact?.images){
			var counter = 0;
			var imageIds = [];
			Object.keys(artifact.images).forEach((k, i) => {
				var thisImage = {
					id:artifact.images[k].id,
					uri:imageBaseUrl + artifact.images[k].name
				};
				artifactImages[counter] =  thisImage;
				imageIds.push(artifact.images[k].id);
				counter++;
			});
			if( !origImageIds[artifact.id] ){
				newOrigImages = origImageIds;
				newOrigImages[artifact.id] = imageIds;
				setOrigImageIds(newOrigImages);
			}
			else{
				setOrigImageIds("empty");				
			}
			if( artifactImages.length > 0 ){
				console.log('artifactImages', artifactImages);
				setGalleryImages(artifactImages);		
				defaultValues.images = artifactImages;
			}
			else{
				setGalleryImages({});		
				defaultValues.images = {};				
			}
		}		
		//console.log('ARTOFACT!! defaultvalues::: ', defaultValues);
		reset({ ...defaultValues });
		setArtifact(artifact);

	}
	useEffect(() => {
		if(isFocused){
			if( id_dela_artifact ){
		        ArtifactsService({
		        	method:'getById',
		        	id:id_dela_artifact
		        })
		        .then( result => setup(result) )
		        .catch( console.log('IN INITIAL EDIT.TSX .error'))
			}
			else{
			}
		}
    }, [isFocused]);         
	const [image, setImage] = useState<string | null>(null);
//	const [scale, setScale] = useState(artifact?.scale ? artifact?.scale : 1);
	const [scale, setScale] = useState( 1);
	const [slideoutState, setslideoutState] = useState('in');
	const [imageState, setImageState] = useState(null);
	const [previewVisible, setPreviewVisible] = useState(false)
	const [capturedImage, setCapturedImage] = useState<any>(null)
	const [cameraType, setCameraType] = useState();
	const [flashMode, setFlashMode] = useState('on');
	const [pickedImagePath, setPickedImagePath] = useState('');
	const [facing, setFacing] = useState<CameraType>('back');
	const [permission, requestPermission] = useCameraPermissions();
	const { session, isLoading } = useSession();
	const [locationLookupState, setlocationLookupState] = useState('initial');
	const [fillLocationMode, setFillLocationMode] = useState('Manually Fill');
 	const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
 	const initialized = useRef(false);
	const [startCamera, setStartCamera] = useState(false)
	const [imageMetaState, setImageMetaState] = useState('closed');

	const { userSession } = useSession();

	const getData = async () => {
		alert('getadta');
		fillLocationModeVal = await AsyncStorage.getItem('fillLocationMode');
		setFillLocationMode(fillLocationModeVal);
		if('Autofill Current Location' == fillLocationModeVal ){
			__useCurrentLocation('loaded');
		}
		else{
		}
	};
	if( Platform.OS !== "web" ){
		useEffect( () => {
			if (!initialized.current && !artifactId ) {
				getData();  
				initialized.current = true;
			}
		})	
	}
/*
	useEffect(() => {
		const showSubscription = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
		const hideSubscription = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

		return () => {
			showSubscription.remove();
		};
	}, []);

	const handleKeyboardShow = event => {
		setIsKeyboardVisible(true);
	};

	const handleKeyboardHide = event => {
		setIsKeyboardVisible(false);
	};
*/	
	function getAddressObject(address_components) {
		var ShouldBeComponent = {
			home: ["street_number"],
			postal_code: ["postal_code"],
			street: ["street_address", "route"],
			region: [
				"administrative_area_level_1",
				"administrative_area_level_2",
				"administrative_area_level_3",
				"administrative_area_level_4",
				"administrative_area_level_5"
			],
			city: [
				"locality",
				"sublocality",
				"sublocality_level_1",
				"sublocality_level_2",
				"sublocality_level_3",
				"sublocality_level_4"
			],
			country: ["country"]
		};

		var address = {
			home: "",
			postal_code: "",
			street: "",
			region: "",
			city: "",
			country: ""
		};
		address_components.forEach(component => {
			for (var shouldBe in ShouldBeComponent) {
				if (ShouldBeComponent[shouldBe].indexOf(component.types[0]) !== -1) {
					if (shouldBe === "country") {
						address[shouldBe] = component.short_name;
					} else {
						address[shouldBe] = component.long_name;
					}
				}
			}
		});
		return address;
	}

	function reverseCoordinateLookup(lat, lng) {
		const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY;
		try {
		let config = {
			method: 'post',
			maxBodyLength: Infinity,
			params:{
				latlng:lat + "," + lng,
				key: `${API_KEY}`
			},
			url: 'https://maps.googleapis.com/maps/api/geocode/json?&location_type=ROOFTOP&result_type=street_address',				
			headers: { 
				'Accept': 'application/json'
			}
		};
		axios.request(config)
			.then( (result) => {
		
				if( 'undefined' != typeof result.data ){


					var components = getAddressObject(result.data.results[0].address_components );
					setValue('address', components.home + " " + components.street);
					setValue('city', components.city);
					setValue('state', components.region);
					setValue('zipcode', components.postal_code);
				}
				else{
	console.log('geo revers result', result);
					//setMachineSession("stuff");
					//router.replace('/map');
				}
			})
			.catch((error) => {
				console.log('error', error);
				if( '401' == error.status ){
				setError('email', { type: 'custom', message: 'Password and Email do not match.' });
						console.log('401');
				}
			})
		} catch (error) {
			console.error("Error:", error);
		}       
	}
	const __onCancel = async ( ) => {
		const state = navigation.getState();
		const currentIndex = state.index;
		const currentScreen = state.routes[currentIndex].name;
	    if( "edit" == currentScreen ){
	    	// check params = if coming from view add a param of source
	    	console.log('isEditscreen!!!!!!!!!!');
	    	navigation.navigate('ProfileTab');
		}
		else{
			router.replace('/');		
		}    
	}
	const onSubmitTest = data => {
		console.log('origImageIds:' , origImageIds);
//	    	navigation.navigate('ProfileTab');
		var form = new FormData();
		var images = [];
		var i = 0;
		galleryImages.forEach(selectedImage => {
			console.log('selectedImage.id', selectedImage.id);
			if( !origImageIds[artifact.id].includes( selectedImage.id ) ){
				console.log('is not in orig');
			}
			else{
				console.log('is in orig');
			}
		});
	}
	const onSubmit = data => {
		var form = new FormData();
		var images = [];
		var i = 0;
		galleryImages.forEach(selectedImage => {
			console.log('artifact.id', artifact.id);
			console.log('origImageIds', origImageIds);
			if( !origImageIds[artifact.id].includes( selectedImage.id ) ){
				if( Platform.OS == "web" ){
					form.append('source', 'web');
					form.append('images[' + i + ']', selectedImage);
				}
				else{
					form.append('source','phone');
					const uri =
					( Platform.OS === "android" || Platform.OS === "web" )
						? selectedImage.uri
						: selectedImage.uri.replace("file://", "");
					const filename = selectedImage.uri.split("/").pop();
					const match = /\.(\w+)$/.exec(filename as string);
					const ext = match?.[1];
					const type = match ? `image/${match[1]}` : `image`;
					form.append('images[' + i + ']', {
						uri,
						name: `image.${ext}`,
						type,
					} as any);
				} 
			}
			i++;

		});
		if( isEdit && artifact?.id ){
			form.append('id',artifact.id);
		}
		form.append('name',data.name);
		form.append('address', data.address);
		form.append('city', data.city);
		form.append('state',data.state);
		form.append('zipcode',data.zipcode);					
		form.append('latitude',data.latitude);
		form.append('longitude',data.longitude);
		form.append('scale',scale);
		if( userSession ){
			var parsedUserSession = JSON.parse(userSession);
			form.append('user_name', parsedUserSession?.user?.name );
			form.append('user_email', parsedUserSession?.user?.email );
		}
            ArtifactsService({
            	method:'create',
            	url:'artifacts',
            	data:form
            }).then( (results) => {
            	console.log('after submit results', results);
		    	navigation.navigate('ProfileTab');

            	// route to edit?
		}).catch(console.log('.error'))					
	};

	const handleToggle = ( event ) => { setSelectedIndex( event.nativeEvent.selectedSegmentIndex); };
	const __clearLocation = async () => {
		console.log('onpress CLEARlOCATION...');
		setValue('latitude', null );
		setValue('longitude', null );	
		setValue('address', null );	
		setValue('city', null );	
		setValue('state', null );	
		setValue('zipcode', null );	
		setlocationLookupState('cleared');

	}
	const __useCurrentLocation = async ( lookupState ) => {
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			return;
		}
		let location = await Location.getCurrentPositionAsync({});
		var latitude = location.coords.latitude;
		var longitude = location.coords.longitude;
		setValue('latitude', JSON.stringify(latitude) );
		setValue('longitude', JSON.stringify(longitude) );	
		reverseCoordinateLookup(latitude, longitude);	
		if(lookupState ){
			setlocationLookupState( lookupState );
		}
	}
	
 const handleFileChange = event => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }

    console.log('fileObj is', fileObj);

    event.target.value = null;
fileObj.uri = URL.createObjectURL(fileObj);
    //console.log(event.target.files);

    //console.log(fileObj);
    //console.log(fileObj.name);
	const cloneDeep = _.cloneDeep(galleryImages);
	cloneDeep.push(fileObj);
	setGalleryImages( cloneDeep );
	setPreviewVisible(true)

    console.log('galleryImages',cloneDeep);

  };
	const __pickImage = async () => {
		/*
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			base64: false,
			aspect: [4, 3],
			quality: 1,
		});
*/
	let  base64  = await ImagePicker.launchImageLibraryAsync({
		mediaTypes: ImagePicker.MediaTypeOptions.All,
		base64: false,
		allowsEditing: true,
		aspect: [4, 3],
		quality: 1
      });


		console.log('result await', base64);
	

		if (base64 && base64?.assets ) {
			console.log('PICKIMAGE SUCCESS');
//			galleryImages.push(result.assets[0]);
//						galleryImages.push(uri);
			const cloneDeep = _.cloneDeep(galleryImages);
			cloneDeep.push(base64.assets[0]);
			setGalleryImages( cloneDeep );
			console.log('galleryImages', cloneDeep);
			setPreviewVisible(true);
		}    
		else{
			console.log('error on pic' )
		}
	};
	const __startCamera = async () => {
		 if (!permission) {
				// Camera permissions are still loading.
			alert('waiting');
			}

			if (!permission.granted) {
				// Camera permissions are not granted yet.
				alert('not granted');
			}    
			else{
				setStartCamera(true)
			}
	}
	const __removePhoto = () => {
	}
	
	
	
	const hide = false;


	return (
		<>
							

			<ImageMeta artifactId={artifact_id} slideoutState={slideoutState} setslideoutState={setslideoutState} imageState={imageState} setImageState={setImageState}></ImageMeta>
			<CameraWrapper galleryState={galleryImages} stateChanger={setGalleryImages} cameraState={startCamera} setCameraState={setStartCamera}></CameraWrapper>

						
			<View style={[s.formButtonSection,{
					paddingTop:50,
					backgroundColor:'rgba(255,255,255,1)',
					elevation:2,
					padding:0,
					position:'absolute'
				}]}>
				<View style={{
						borderTopWidth: 1,
					    borderColor: '#e0e0e0',
					    borderStyle: 'solid',				
					    width:'100%',
					    padding:20,
					    paddingTop:7,				 
					    paddingBottom:14,				 
				        flexDirection:'row'						
					}}>		
						<Pressable 
							style={({pressed}) => [
											{
									backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
									alignItems: 'center',
									justifyContent: 'center',
									borderRadius: 20,
									height:40,
									marginTop:10,
									width:40,
									elevation: 3,
									marginRight:5,
									boxShadow: '0px 2px 2px #d8d8d8'						        
											}
							]}
							onPress={ () => { __onCancel() }}

						>
							<Ionicons name="arrow-back-outline" size={30} color="" style={{
										display:'flex-inline',
										height:30,
										width:30,
										borderRadius:16,								
							}}/>
						</Pressable>																						
						<CustomButton
							styles={{
								borderRadius: 20,
								elevation: 3,
								color:'black',
								marginLeft: 'auto',					    		
							}}						
							title={ "Cancel" }
							onPress={ () => { __onCancel() }}
						/>
						<CustomButton
							styles={{
								borderRadius: 20,
								elevation: 3,
								color:'black',
								marginLeft: 20,					    		
							}}						
							title={ isEdit ? "Update" : "Save" }
							onPress={handleSubmit(onSubmit)}
						/>
					</View>
			</View>					
						{ artifactId ? (
							<View style={{
								position:'absolute',
								bottom:30,
								left:10,
								zIndex:999
							}}>
									<Pressable 
										style={({pressed}) => [
														{
												backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
												alignItems: 'center',
												justifyContent: 'center',
												borderRadius: 40,
												height:80,
												width:80,
												elevation: 8,
												marginLeft: 'auto',					    		
												marginRight:5,
												boxShadow: '0px 2px 2px #d8d8d8'						        
														}
										]}
										onPress={() => { navigation.navigate('show', { params: { artifactId: 24 } }) }}
									>
										<Text>View</Text>
									</Pressable> 
							</View>				
							) : null }			
			<ScrollView 
				style={[s.mainContainer,{zIndex:-1}]} 
				contentContainerStyle={[s.mainContentContainer]}
			>
				<View style={[s.formOuterWrapper,{paddingTop:128}]}>
					<View style={s.formWrapper}>
						<View style={s.formSection}>

							<View style={s.fieldWrapper}>
								<Text style={s.label}>Name</Text>
								<Controller
									control={control}


									render={({field: { onChange, onBlur, value }}) => (
										<TextInput
											style={s.input}
											onBlur={onBlur}
											onChangeText={value => onChange(value)}
											value={(value) ? value : ""}
										/>
									)}
									name="name"
									rules={{ required: true }}
								/>
								<Text style={{color:'white', height:'30px'}}>
									{errors.name && errors.name.message }
								</Text>
							</View>
						</View>
						<View style={s.formSection}>
							<View style={s.fieldWrapperHalf}>
								<Text style={s.label}>Scale</Text>

								<SegmentedControl
									name='scale'
									values={['Public Space', 'Structure', 'Detail']}
									selectedIndex={scale}
									onChange={(event) => { setScale(event.nativeEvent.selectedSegmentIndex) }}
								/>							

							</View>
						</View>        
						<View style={s.formSection}>
							<View style={s.formSectionTitleWrapper}>
								<Text style={s.formSectionTitle}>Location</Text>
								{/* (Platform.OS !== 'web' && "Manually Fill" == fillLocationMode) ? ( */}
								<Pressable 
									style={({pressed}) => [
													{
											backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
											alignItems: 'center',
											justifyContent: 'center',
											borderRadius: 20,
											height:40,
											width:40,
											elevation: 3,
											marginLeft: 'auto',					    		
											marginRight:5,
											boxShadow: '0px 2px 2px #d8d8d8'						        
													}
									]}
										onPress={ () => { 
											( ('initial' == locationLookupState && "Manually Fill" == fillLocationMode) || 'cleared' == locationLookupState ) ? 
											__useCurrentLocation( 'loaded' )  : __clearLocation(); 
										}}
								>
									{  ('initial' == locationLookupState || 'cleared' == locationLookupState) ? (
										<Ionicons name="locate-outline" size={30} color="" style={{
													display:'flex-inline',
													height:30,
													width:30,
													borderRadius:16,								
										}}/>
									) : ( ( 'loaded' == locationLookupState ) ? (
										<Ionicons name="close-outline" size={30} color="" style={{
													display:'flex-inline',
													height:30,
													width:30,
													borderRadius:16,								
										}}/>
									) : null ) }
								</Pressable>
							</View>
						</View>

						<View style={s.formSection}>
							<View style={s.fieldWrapper}>
								<View style={s.labelWrapper}>
									<Text style={s.label}>Address</Text>
								</View>
								<Controller
									control={control}
									render={({field: { onChange, onBlur, value="" }}) => (
										<TextInput
											style={s.input}
											onBlur={onBlur}
											onChangeText={value => onChange(value)}
											value={(value) ? value : ""}
										/>
									)}
									name="address"
								/>
							</View>
							<View style={s.fieldsWrapperContainer}>
								<View style={s.fieldsWrapper}>
									<Text style={s.label}>City</Text>
									<Controller
										control={control}
										render={({field: { onChange, onBlur, value="" }}) => (
											<TextInput
												style={s.input}
												onBlur={onBlur}
												onChangeText={value => onChange(value)}
												value={(value) ? value : ""}
											/>
										)}
										name="city"
									/>
								</View>
								<View style={{}}>
									<Text style={s.label}>State</Text>
									<Controller
										control={control}
										render={({field: { onChange, onBlur, value="" }}) => (
											<TextInput
												style={{
															backgroundColor: 'white',
															borderColor: 'none',
															height: 40,
															padding: 10,
															borderRadius: 4,        
															width:70											
												}}
												onBlur={onBlur}
												onChangeText={value => onChange(value)}
												value={(value) ? value : ""}
											/>
										)}
										name="state"
									/>
								</View>						
								<View style={{}}>
									<Text style={s.label}>Zipcode</Text>
									<Controller
										control={control}
										render={({field: { onChange, onBlur, value="" }}) => (
											<TextInput
												style={{
															backgroundColor: 'white',
															borderColor: 'none',
															height: 40,
															padding: 10,
															borderRadius: 4,        
															width:100											
												}}
												onBlur={onBlur}
												onChangeText={value => onChange(value)}
												value={(value) ? value : ""}
											/>
										)}
										name="zipcode"
									/>
								</View>						

							</View>

							<View style={s.fieldWrapperHalfContainer}>
								<View style={s.fieldWrapperHalf}>
									<Text style={s.label}>Latitude</Text>
									<Controller
										control={control}
										render={({field: { onChange, onBlur, value="" }}) => (
											<TextInput
												style={s.input}
												onBlur={onBlur}
												onChangeText={value => onChange(value)}
												value={value}
											/>
										)}
										name="latitude"
									/>
								</View>
								<View style={s.fieldWrapperHalf}>
									<Text style={s.label}>Longitude</Text>
									<Controller
										control={control}
										render={({field: { onChange, onBlur, value="" }}) => (
											<TextInput
												style={s.input}
												onBlur={onBlur}
												onChangeText={value => onChange(value)}
												value={value}
											/>
										)}
										name="longitude"
									/>
								</View>
							</View>

						</View>
						<View style={s.formSection}>
							<View style={s.formSectionTitleWrapper}>
								<Text style={s.formSectionTitle}>Images</Text>
								{ (Platform.OS == 'web') ? 
								(<FilePicker 
									onChange={handleFileChange}
								></FilePicker>) : null }
								{( Platform.OS !== "web" ) ? (
									<>

								<Pressable 
									style={({pressed}) => [
													{
											backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
											alignItems: 'center',
											justifyContent: 'center',
											borderRadius: 20,
											height:40,
											width:40,
											elevation: 3,
											marginLeft: 'auto',					    		
											marginRight:25,
											boxShadow: '0px 2px 2px #d8d8d8'						        
													}
									]}
										onPress={ () => { __pickImage() }}
								>
									<Ionicons name="image-outline" size={30} color="" style={{
												display:'flex-inline',
												height:30,
												width:30,
												borderRadius:16,								
									}}/>
									</Pressable>						
								<Pressable 
									style={({pressed}) => [
													{
											backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
											alignItems: 'center',
											justifyContent: 'center',
											borderRadius: 20,
											height:40,
											width:40,
											elevation: 3,
											marginRight:5,
											boxShadow: '0px 2px 2px #d8d8d8'						        
													}
									]}
										onPress={ () => { 
										__startCamera();
										}}
								>
									<Ionicons name="camera-outline" size={30} color="" style={{
												display:'flex-inline',
												height:30,
												width:30,
												borderRadius:16,								
									}}/>
									</Pressable>
								</>) : null }						
							</View>
						</View>
						<View style={{flex:1 }}>
							{galleryImages && galleryImages.length > 0 ? (
								<FlatList
									contentContainerStyle={{ flexGrow:1,paddingTop:20, marginRight:'auto'}}
									horizontal={true} 
									showsHorizontalScrollIndicator={true} 
									data={galleryImages}
									extraData={galleryImages}
									keyExtractor={(item, index) => {return  index.toString();}}
									renderItem={ ({ item, index }) => (
										<View key={item.id} serverId={item.id} style={{}}>
										<Image source={{uri:item.uri}} /* Use item to set the image source */
											style={{
												width:150,
												height:150,
												backgroundColor:'#d0d0d0',
												//resizeMode:'contain',
												margin:6
											}}
										/>
										<Pressable 
									style={({pressed}) => [
													{
											backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
											alignItems: 'center',
											justifyContent: 'center',
											borderRadius: 20,
											height:40,
											width:40,
											position:'absolute',
											top:-7,
											right:-7,
											elevation: 3,
											marginRight:5,
											boxShadow: '0px 2px 2px #d8d8d8'						        
													}
									]}
										onPress={ () => { 
											item.name="test";

										setslideoutState( 'out' );
										setImageState( item );
										}}
								>
									<Ionicons name="pencil-outline" size={30} color="" style={{
												display:'flex-inline',
												height:30,
												width:30,
												borderRadius:16,								
									}}/>
									</Pressable>
										</View>
									)}
								/>
							) : (
								<View style={[s.iconWrapper,{flex:1, flexDirection:'row',maxWidth:'1100px', alignItems: 'center'}]}>  
									<Ionicons name="image-outline" size={70} color="#d8d8d8" style={{display:'flex'}}/>						
									<Ionicons name="image-outline" size={70} color="#d8d8d8" style={{display:'flex'}}/>
									<Ionicons name="image-outline" size={70} color="#d8d8d8" style={{display:'flex'}}/>
									<Ionicons name="image-outline" size={70} color="#d8d8d8" style={{display:'flex'}}/>
								</View>
							)}
						</View>
						{image && <Image source={{ uri: image }} style={styles.image} />}
						<View style={styles.imageContainer}>
							{
								pickedImagePath !== '' && <Image
									source={{ uri: pickedImagePath }}
									style={styles.image}
								/>
							}
						</View>

					</View>
					
				</View>
				<StatusBar style={{display:'block'}} />			
							
			</ScrollView>
		</>
	)
}

const styles = StyleSheet.create({
	input: {

	},
	imageContainer: {
		//padding: 30
	},
	image: {
		width: 400,
		height: 300,
		resizeMode: 'cover'
	},  
});

const GalleryImage = ({photo, removePhoto}: any) => {
	console.log('sdsfds', photo)
	return (
		<View
			style={{
				backgroundColor: 'yellow',
				flex: 1,
				width: '200px',
				height: '200px'
			}}
		>
			<ImageBackground
				source={{uri: photo && photo.uri}}
				style={{
					flex: 1
				}}
			>
				<View
					style={{
						flex: 1,
						flexDirection: 'column',
						padding: 15,
						justifyContent: 'flex-end'
					}}
				>
					<View
						style={{
							flexDirection: 'row',
							justifyContent: 'space-between'
						}}
					>
						
						<TouchableOpacity
							onPress={removePhoto}
							style={{
								width: 130,
								height: 40,

								alignItems: 'center',
								//borderRadius: 4
							}}
						>
							<Text
								style={{
									color: '#fff',
									fontSize: 20
								}}
							>
								Delete
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ImageBackground>
		</View>
	)
}
