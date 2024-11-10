//https://www.freecodecamp.org/news/how-to-create-a-camera-app-with-expo-and-react-native/
import {StatusBar} from 'expo-status-bar'
import React, { useState, useEffect, useRef } from 'react'
import axios from 'axios';
import { router, Link,useFocusEffect, useNavigation } from 'expo-router';
import querystring from 'querystring';
import { useForm, Controller } from 'react-hook-form';
import Ionicons from '@expo/vector-icons/Ionicons';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import {Alert,  FlatList, Image, ImageBackground, Keyboard, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import {CameraView, CameraType, useCameraPermissions} from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useSession } from '@/ctx';
import * as ImagePicker from 'expo-image-picker';
import * as Location from "expo-location";
import CustomButton from '@/components/Button';
import FilePicker from '@/components/FilePicker';
//import base64ToFile from '@/utilities/ImageHandler';
import AsyncStorage from '@react-native-async-storage/async-storage';
import FormData from 'form-data';
import Compressor from 'compressorjs';
import { Asset } from 'expo-asset';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { useNavigationState } from '@react-navigation/native';

const s = require('@/components/style');

let camera: CameraView

export default function AddEdit( {navigation, artifact} ) {

	const isEdit = artifact ? true : false;

	var artifactImages = [];
	const imageBaseUrl = "https://zkd.b51.mytemp.website/images/";
	
	const pageTitle = null;//!artifact ? 'Add an Artifact' : 'Edit ' + artifact.name;
	if('undefined' != typeof artifact && 'undefined' != typeof artifact?.images){
		var counter = 0;
		Object.keys(artifact.images).forEach((k, i) => {
			var thisImage = {
				id:artifact.images[k].id,
				uri:imageBaseUrl + artifact.images[k].name
			};
			artifactImages[counter] =  thisImage;
			counter++;
		});
	}
	const [galleryImages, setGalleryImages] = useState(artifactImages);

	Object.keys(galleryImages).forEach((k, i) => {
		console.log('galleryImage k', k);
		console.log('galleryImage ::', galleryImages[k]);
	});
	var defaultValues = artifact ? artifact : {};
	defaultValues.latitude = artifact?.latitude;
	defaultValues.longitude = artifact?.longitude;
	const { register, setError, getValues, setValue, handleSubmit, control, reset, formState: { errors } } = useForm({
		defaultValues: defaultValues
	});
	const [image, setImage] = useState<string | null>(null);
	const [scale, setScale] = useState(artifact?.scale ? artifact?.scale : 1);
	const [startCamera, setStartCamera] = useState(false)
	const [previewVisible, setPreviewVisible] = useState(false)
	const [capturedImage, setCapturedImage] = useState<any>(null)
	const [cameraType, setCameraType] = useState()
	const [flashMode, setFlashMode] = useState('off')
	const [pickedImagePath, setPickedImagePath] = useState('');
	const [facing, setFacing] = useState<CameraType>('back');
	const [permission, requestPermission] = useCameraPermissions();
	const { session, isLoading } = useSession();
	const [locationLookupState, setlocationLookupState] = useState('initial');
	const [fillLocationMode, setFillLocationMode] = useState('Manually Fill');
 	const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
 	const initialized = useRef(false);
		
	const getData = async () => {
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
			if (!initialized.current) {
				getData();  
				initialized.current = true;
			}
		})	
	}

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
				console.log('result from lookup', result.data.results[0]);
		
				if( 'undefined' != typeof result.data ){


					var components = getAddressObject(result.data.results[0].address_components );
				console.log('components',components);
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
	    console.log('currentScreen',currentScreen);
	    if( "edit" == currentScreen ){
	    	// check params = if coming from view add a param of source
	    	console.log('isEditscreen!!!!!!!!!!');
	    	navigation.navigate('ProfileTab');
		}
		else{
			router.replace('/');		
		}    
	}
	const onSubmit = data => {
		console.log('onsubmit start', data);

		const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN;

		var form = new FormData();
		console.log('onsubmit data', data);
		var images = [];
		var i = 0;
console.log('upload galleryimages', galleryImages);
		galleryImages.forEach(selectedImage => {
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

	console.log('uri in onsubmit', uri);
				form.append('images[' + i + ']', {
					uri,
					name: `image.${ext}`,
					type,
				} as any);
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

		try {
			let config = {
				method: 'post',
				maxBodyLength: Infinity,
				data:form,
				url: 'https://zkd.b51.mytemp.website/api/artifacts/store',
				headers: { 
					'Accept': 'application/json',
					'Authorization': `Bearer ${API_TOKEN}`,
					"Content-Type": "multipart/form-data"					      
				}
			};
			console.log('config:', config);
			axios.request(config)
				.then( (result) => {
					console.log('result of axios:', result);
					if( 'undefined' != typeof result.data ){
						//setMachineSession("stuff");
						router.replace('/map');
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
					
	};

	const handleToggle = ( event ) => { setSelectedIndex( event.nativeEvent.selectedSegmentIndex); };
	const postArt = async () => {
		const formdata = new FormData();
		formdata.append("name", "rando");
		const requestOptions = {
			headers: {
					Accept: "application/json",
					"Content-Type": "application/json",
					"Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiMjJhZDRhNGIwODA0ZDkwMTM4MzY1NzljNGQxYWFlNWI1ODc2YjYzNWY3YjdiYTJkMzI3MTUwZGRhOTAxZWQ4YjdmMDM2NTc3MDJiNmI2M2QiLCJpYXQiOjE3MjkwNDczNjUuMDgwNzY4LCJuYmYiOjE3MjkwNDczNjUuMDgwNzcsImV4cCI6MTc2MDU4MzM2NS4wNzYyMiwic3ViIjoiIiwic2NvcGVzIjpbIioiXX0.q-FYTDDONhdz0NrGHBheUJqRmIxv6mlUtDOjfO2Wqi-reupe_fTaQujRkApYM_XvcyA8cN5x1qiucu-DzKbDN0PwzgLPuuQxt5L0qRQ2mWRx7rk_C0bT18nXQgwARljS2gIxihIjJGQAeoajwxm4Mhl7ziZ6tOjpVmokOEgWyGTPfqAd1mxIIfS2hhZuTU2F3T-J0ujqLjdUK1xX6bM_Vt_NYnfWkc-tCE5am1DmDiO33l63iQ6N8aUrfHhkQBLCiAtmMCw0h9EsD_d8L-37kPL7vDDoOUPPaE-NeZ4NpAQc_qpmfHIuOiAG7HX7KTWVqoapu9awue2SvaxZHQo9prkoCqN7uwxGXeSDBo2KXioIhP38Q_UKNaaih42Bw04WcJveSeIt8nAxHoA6Plyim9-BL2MY1Rq2ARS5PiLlEz1lSBrJeRzB-Tf8CaSBVuTCaA19mvGwLaOV4BC1YlCRwAaC_ASjrJrkU2xFwFi2tcu9-57GfJI9kVQhSS4Gja4_MkZ-LCVVaSYU0s08e-sFBoKJI6OtZKHAhruC8-nfu4UX3Q3-26KTMiKOlfw7ETwHYA2oCRyjYPre8DS-StH9chqdyb4Zml-V6SLBasrWlmWb-8fJOsFxWRHsRD4lD6TcAN98I_uWgTUZjOOZ5BjtCBYTIpA4CxEtyQCfP0g2By0",
			},
			method: "POST",
			body: formdata,
			redirect: "follow"
		};
		let config = {
			method: 'post',
			maxBodyLength: Infinity,
			url: 'https://zkd.b51.mytemp.website/api/artifacts?name=what',
			headers: { 
				'Accept': 'application/json', 
				'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiMjJhZDRhNGIwODA0ZDkwMTM4MzY1NzljNGQxYWFlNWI1ODc2YjYzNWY3YjdiYTJkMzI3MTUwZGRhOTAxZWQ4YjdmMDM2NTc3MDJiNmI2M2QiLCJpYXQiOjE3MjkwNDczNjUuMDgwNzY4LCJuYmYiOjE3MjkwNDczNjUuMDgwNzcsImV4cCI6MTc2MDU4MzM2NS4wNzYyMiwic3ViIjoiIiwic2NvcGVzIjpbIioiXX0.q-FYTDDONhdz0NrGHBheUJqRmIxv6mlUtDOjfO2Wqi-reupe_fTaQujRkApYM_XvcyA8cN5x1qiucu-DzKbDN0PwzgLPuuQxt5L0qRQ2mWRx7rk_C0bT18nXQgwARljS2gIxihIjJGQAeoajwxm4Mhl7ziZ6tOjpVmokOEgWyGTPfqAd1mxIIfS2hhZuTU2F3T-J0ujqLjdUK1xX6bM_Vt_NYnfWkc-tCE5am1DmDiO33l63iQ6N8aUrfHhkQBLCiAtmMCw0h9EsD_d8L-37kPL7vDDoOUPPaE-NeZ4NpAQc_qpmfHIuOiAG7HX7KTWVqoapu9awue2SvaxZHQo9prkoCqN7uwxGXeSDBo2KXioIhP38Q_UKNaaih42Bw04WcJveSeIt8nAxHoA6Plyim9-BL2MY1Rq2ARS5PiLlEz1lSBrJeRzB-Tf8CaSBVuTCaA19mvGwLaOV4BC1YlCRwAaC_ASjrJrkU2xFwFi2tcu9-57GfJI9kVQhSS4Gja4_MkZ-LCVVaSYU0s08e-sFBoKJI6OtZKHAhruC8-nfu4UX3Q3-26KTMiKOlfw7ETwHYA2oCRyjYPre8DS-StH9chqdyb4Zml-V6SLBasrWlmWb-8fJOsFxWRHsRD4lD6TcAN98I_uWgTUZjOOZ5BjtCBYTIpA4CxEtyQCfP0g2By0', 
				'Cookie': 'XSRF-TOKEN=eyJpdiI6IjdlbXRyTHFmVS9udFNpUTRaTENCUnc9PSIsInZhbHVlIjoiQndGNk1hYlBYZUk0Y1ZYOWxLZ3B5T2dqaG1heW9pS2txYzJybzBjelR2RXRRYjQyYmlMZlVEcnU1VDE2bVROb3BlVUd2b3J3SVpTZmNVb24xYktYZitnSUo3bGorQTFhdm1SSFJ2d1d3N1hGQmx6all4WVJJbTRUY29UVFlaS2IiLCJtYWMiOiI1ZjUwNzNlMmJmODU2MDNiNzE4MzU0ZjdkYjljZWFiNGJiOGNmNTgzODMwM2IzOGI0MGEyZDFmY2JiZmE0MWIyIiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6ImFmcG5Jc0JRT2NvTjZPRTIrci9yWlE9PSIsInZhbHVlIjoiZGRBTURBRVlsenB5d3RPb3d0Q1Bna1c3WHZKdG9ZbzMvTkZHb0dwTWQ2akFCOEZQWkZXejdFRUk1T2VNQjRFR2NjRFY0OWFxSTBlYitXck5UVThpcm5UNjBpMGN0UmJIMEtTOEZBNGw0R1UxMkVlbzl1cmlXMy9TNXFOLzdvNzIiLCJtYWMiOiI3ZjBlOWU2ZDU3ZTQwZmViMjQ1OGI5YjJmY2FlMDg5N2NmZTQ5MGEyNGMzNmRiZjkwNWMyOWJhYjU4MDE3M2RlIiwidGFnIjoiIn0%3D'
			}
		};
		axios.request(config)
		.then((response) => {
			console.log(JSON.stringify(response.data));
		})
		.catch((error) => {
			console.log(error);
		});
	}
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
	const __takePicture = async () => {
		const photo: any = await camera.takePictureAsync()
		console.log(photo)
		setPreviewVisible(true)

		setCapturedImage(photo)
	}
 const handleFileChange = event => {
    const fileObj = event.target.files && event.target.files[0];
    if (!fileObj) {
      return;
    }

    console.log('fileObj is', fileObj);

    // 👇️ Reset file input
    event.target.value = null;

    // 👇️ Is now empty
    console.log(event.target.files);

    // 👇️ Can still access the file object here
    console.log(fileObj);
    console.log(fileObj.name);
	galleryImages.push(fileObj);
	setGalleryImages( galleryImages );

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
	

		if (base64) {

   

//console.log('new uri', uri);
			console.log('PICKIMAGE SUCCESS');
			console.log(base64.assets[0]);
//			galleryImages.push(result.assets[0]);
//						galleryImages.push(uri);

			galleryImages.push(base64.assets[0]);
			setGalleryImages( galleryImages );
			console.log('galleryImages', galleryImages);
			setPreviewVisible(true)
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
	const __savePhoto = async () => {

//		var result = await MediaLibrary.saveToLibraryAsync(capturedImage.uri);
//		console.log('after save to library:::::::', result);    

 	const manipResult = await manipulateAsync(
      capturedImage.uri,
      [{ resize: { width: capturedImage.width * 0.3 } }],
      { compress: .5 }
    );	
		console.log('after save to library:::::::', manipResult);    
		galleryImages.push(manipResult);
		setGalleryImages( galleryImages );
console.log('galleryImages', galleryImages);
		setCapturedImage(null)
		setPreviewVisible(false)
		setStartCamera(false)

	}
	const __retakePicture = () => {
		setCapturedImage(null)
		setPreviewVisible(false)
		__startCamera()
	}
	const __handleFlashMode = () => {
		if (flashMode === 'on') {
			setFlashMode('off')
		} else if (flashMode === 'off') {
			setFlashMode('on')
		} else {
			setFlashMode('auto')
		}
	}
	const __switchCamera = () => {
		if (cameraType === 'back') {
			setCameraType('front')
		} else {
			setCameraType('back')
		}
	}
	const hide = false;


	return (
		<>
			<View style={[s.formButtonSection,{
					paddingTop:50,
					backgroundColor:'rgba(255,255,255,1)',
					zIndex:999,
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
						{ artifact ? (
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
				style={[s.mainContainer]} 
				contentContainerStyle={s.mainContentContainer}
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
								(<FilePicker onChange={handleFileChange}></FilePicker>) : null }
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
							</View>
						</View>


					</View>
					<View style={s.formWrapperTwo}>  
						{startCamera ? (
							<View
								style={{
									flex: 1,
									width: '100%',
									height:200,
									background:'yellow'
								}}
							>
							<Text>startcamera</Text>
								{previewVisible && capturedImage ? (
									<View style={{height:300, width:300, background:'red'}}>
										<CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} />
									</View>
								) : (
									<CameraView
										type={cameraType}
										flashMode={flashMode}
										style={{flex: 1, height:200}}
										ref={(r) => {
											camera = r
										}}
									>
										<View
											style={{
												flex: 1,
												height:200,
												width: '100%',
												backgroundColor: 'transparent',
												flexDirection: 'row'
											}}
										>
											<View
												style={{
													position: 'absolute',
													left: '5%',
													top: '10%',
													flexDirection: 'column',
													justifyContent: 'space-between'
												}}
											>
												<TouchableOpacity
													onPress={__handleFlashMode}
													style={{
														backgroundColor: flashMode === 'off' ? '#000' : '#fff',
														//borderRadius: '50%',
														height: 25,
														width: 25
													}}
												>
													<Text
														style={{
															fontSize: 20
														}}
													>
														⚡️
													</Text>
												</TouchableOpacity>
												<TouchableOpacity
													onPress={__switchCamera}
													style={{
														marginTop: 20,
													 // borderRadius: '50%',
														height: 25,
														width: 25
													}}
												>
													<Text
														style={{
															fontSize: 20
														}}
													>
														{cameraType === 'front' ? '🤳' : '📷'}
													</Text>
												</TouchableOpacity>
											</View>
											<View
												style={{
													position: 'absolute',
													bottom: 0,
													flexDirection: 'row',
													flex: 1,
													width: '100%',
													padding: 20,
													justifyContent: 'space-between'
												}}
											>
												<View
													style={{
														alignSelf: 'center',
														flex: 1,
														alignItems: 'center'
													}}
												>
													<TouchableOpacity
														onPress={__takePicture}
														style={{
															width: 70,
															height: 70,
															bottom: 0,
															//borderRadius: 50,
															backgroundColor: '#fff'
														}}
													/>
												</View>
											</View>
										</View>
									</CameraView>
								)}
							</View>
						) : (
							<></>
						)}
						<View style={{flex:1, flexDirection:'row', marginTop:0}}>
							{galleryImages && galleryImages.length > 0 ? (
								<FlatList
									horizontal={true} 
									showsHorizontalScrollIndicator={false} 
									data={galleryImages}
									renderItem={ ({ item, index }) => (
										<Image source={{uri:item.uri}} /* Use item to set the image source */
											key={index} /* Important to set a key for list items,
																but it's wrong to use indexes as keys, see below */
											serverId={item.id}
											style={{
												width:150,
												height:150,
												backgroundColor:'#d0d0d0',
												//resizeMode:'contain',
												margin:6
											}}
										/>
									)}
								/>
							) : (
								<>
									<Ionicons name="image-outline" size={70} color="#d8d8d8" style={{display:'flex'}}/>						
									<Ionicons name="image-outline" size={70} color="#d8d8d8" style={{display:'flex'}}/>
									<Ionicons name="image-outline" size={70} color="#d8d8d8" style={{display:'flex'}}/>
									<Ionicons name="image-outline" size={70} color="#d8d8d8" style={{display:'flex'}}/>
								</>
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
				<StatusBar style="auto" />			
							
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
				backgroundColor: 'blue',
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
const CameraPreview = ({photo, retakePicture, savePhoto}: any) => {
	console.log('sdsfds', photo)
	return (
		<View
			style={{
				backgroundColor: 'blue',
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
							onPress={retakePicture}
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
								Re-take
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={savePhoto}
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
								save photo
							</Text>
						</TouchableOpacity>
					</View>
				</View>
			</ImageBackground>
		</View>
	)
}