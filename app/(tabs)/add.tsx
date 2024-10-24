//https://www.freecodecamp.org/news/how-to-create-a-camera-app-with-expo-and-react-native/
import {StatusBar} from 'expo-status-bar'
import React, { useState } from 'react'
import axios from 'axios';
import { router, Link } from 'expo-router';
import querystring from 'querystring';
import { useForm, Controller } from 'react-hook-form';
import Ionicons from '@expo/vector-icons/Ionicons';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import {Alert, Image, ImageBackground, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import {CameraView, CameraType, useCameraPermissions} from 'expo-camera';
import * as MediaLibrary from 'expo-media-library';
import { useSession } from '../../ctx';
import * as ImagePicker from 'expo-image-picker';
import * as Location from "expo-location";
import Button from '@/components/Button';
import Popup from '@/components/ModalHelp';

const s = require('@/components/style');

let camera: CameraView

export default function App() {

		const { register, setError, setValue, handleSubmit, control, reset, formState: { errors } } = useForm({
		defaultValues: {
			email: '',
			password: ''
		}
	});
	const [image, setImage] = useState<string | null>(null);
	const [startCamera, setStartCamera] = useState(false)
	const [previewVisible, setPreviewVisible] = useState(false)
	const [capturedImage, setCapturedImage] = useState<any>(null)
	const [cameraType, setCameraType] = useState()
	const [flashMode, setFlashMode] = useState('off')
	const [pickedImagePath, setPickedImagePath] = useState('');
	const [facing, setFacing] = useState<CameraType>('back');
	const [permission, requestPermission] = useCameraPermissions();
	const { session, isLoading } = useSession();
	const [selectedIndex, setSelectedIndex] = useState(1);

	// ModalHelp
	const [visible, setVisible] = useState(false);
	const __loadHelp = (section) => {
		setVisible(true);
	}
	const __closeHelp = () => {
		setVisible(false);
	}
	// End ModalHelp

	const pickImage = async () => {
		// No permissions request is necessary for launching the image library
		let result = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1,
		});

		console.log(result);

		if (!result.canceled) {
			setImage(result.assets[0].uri);

			setPickedImagePath(result.uri);
			console.log(result.uri);
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
      console.log('address_components', address_components);
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
console.log('/');
console.log('/');
console.log('/');
//      script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}`;
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
					var components = getAddressObject(result.data.results[0].address_components );
					console.log(components);
					setValue('address', components.home + " " + components.street);
					setValue('city', components.city);
					setValue('state', components.region);
					setValue('zipcode', components.postal_code);
					if( 'undefined' != typeof result.data ){
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



 const onSubmit = data => {
	console.log('data in submit', data);
		const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN;
		try {
			let config = {
				method: 'post',
				maxBodyLength: Infinity,
				data:{
					name:data.name,
					latitude:data.latitude,
					longitude:data.longitude
				},
				url: 'https://zkd.b51.mytemp.website/api/artifacts/store',
				headers: { 
					'Accept': 'application/json',
					'Authorization': `Bearer ${API_TOKEN}`         
				}
			};
			axios.request(config)
				.then( (result) => {
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

const handleToggle = (
	event
	) => {
		setSelectedIndex(      event.nativeEvent.selectedSegmentIndex);
	};


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
	const __useCurrentLocation = async () => {

		console.log('use currentloc');
		let { status } = await Location.requestForegroundPermissionsAsync();
		if (status !== "granted") {
			console.log("Permission to access location was denied");
			return;
		}

		let location = await Location.getCurrentPositionAsync({});
		var latitude = location.coords.latitude;
		var longitude = location.coords.longitude;
		setValue('latitude', JSON.stringify(latitude) );
		setValue('longitude', JSON.stringify(longitude) );	
		reverseCoordinateLookup(latitude, longitude);	
	}
	const __takePicture = async () => {
		const photo: any = await camera.takePictureAsync()
		console.log(photo)
		setPreviewVisible(true)
		setCapturedImage(photo)
	}


	const __saveArtifact = () => {
		alert(1);
		postArt();
	}
	const __savePhoto = () => {
console.log(capturedImage);
		setCapturedImage(null)
		setPreviewVisible(false)
		setStartCamera(false)
		MediaLibrary.saveToLibraryAsync(capturedImage.uri);    
// now need to share image to api
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
	return (
		<>
			<View style={[s.formButtonSection,{elevation:4}]}>
				<View style={s.fieldWrapperHalfContainer}>
					<View style={s.fieldWrapperHalf}>												
						<Button
							style={s.formButton}
							title="Reset"
							onPress={() => {
								reset({
									name: 'test',
									latitude: '32.208080',
									longitude: '-110.965510'
								})
							}}
						/>
					</View>
					<View style={s.fieldWrapperHalf}>																		
						<Button
							style={s.formButton}
							title="Save"
							onPress={handleSubmit(onSubmit)}
						/>
					</View>
				</View>
			</View>					

		<ScrollView 
			style={s.mainContainer} 
			contentContainerStyle={s.mainContentContainer}
		>
			<View style={s.formOuterWrapper}>
			<View style={s.formWrapper}>

     <Popup
      visible={visible}
      transparent={true}
      dismiss={__closeHelp}
      margin={"10%"}
      content={'location'}
     >
		<View style={s.popupContent} >		      	
			<Text style={{fontSize:18}}>
			To use your current location click the locate button: <Ionicons name="locate-outline" size={22} color="" style={{
		        display:'block',
			}}/> 		     </Text>
		</View>
     </Popup>
				<View style={s.formSection}>
					<View style={s.formSectionTitleWrapper}>
						<Text style={[s.formSectionTitle,{marginTop:-15}]}>General</Text>
					</View>				
					<View style={s.fieldWrapper}>
						<Text style={s.label}>Name</Text>
						<Controller
							control={control}
							render={({field: { onChange, onBlur, value }}) => (
								<TextInput
									style={s.input}
									onBlur={onBlur}
									onChangeText={value => onChange(value)}
									value={value}
									errors={errors}
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
							values={['Public Space', 'Structure', 'Detail']}
							selectedIndex={selectedIndex}
							onChange={(event) => { setSelectedIndex(event.nativeEvent.selectedSegmentIndex) }}
							onValueChange={(value)=>console.log({value})}
						/>
					</View>
				</View>        
				<View style={s.formSection}>
					<View style={s.formSectionTitleWrapper}>
						<Text style={s.formSectionTitle}>Location</Text>
							<Pressable 
						    	style={{
							        marginRight:10,
							        marginLeft:-8,
							        padding:14
						    	}}
						    	onPress={ () => { 
						    		__loadHelp('location'); 
						    	}}

							>
								<Ionicons name="help-circle-outline" size={20} color="" style={{
							        display:'flex-inline',
							        borderRadius:10,
							        marginTop:-10
								}}/>
						    </Pressable>
						{ (Platform.OS !== 'web') ? (
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
					    		__useCurrentLocation() 
					    	}}
						>
							<Ionicons name="locate-outline" size={30} color="" style={{
						        display:'flex-inline',
						        height:30,
						        width:30,
						        borderRadius:16,								
							}}/>
					    </Pressable>
					    ) : null }

					</View>
				</View>
				<View style={s.formSection}>
					<View style={s.fieldWrapper}>
						<View style={s.labelWrapper}>
							<Text style={s.label}>Address</Text>
						</View>
						<Controller
							control={control}
							render={({field: { onChange, onBlur, value }}) => (
								<TextInput
									style={s.input}
									onBlur={onBlur}
									onChangeText={value => onChange(value)}
									value={value}
								/>
							)}
							name="address"
							rules={{ required: true }}
						/>
					</View>
					<View style={s.fieldsWrapperContainer}>
						<View style={s.fieldsWrapper}>
							<Text style={s.label}>City</Text>
							<Controller
								control={control}
								render={({field: { onChange, onBlur, value }}) => (
									<TextInput
										style={s.input}
										onBlur={onBlur}
										onChangeText={value => onChange(value)}
										value={value}
									/>
								)}
								name="city"
								rules={{ required: true }}
							/>
						</View>
						<View style={{}}>
							<Text style={s.label}>State</Text>
							<Controller
								control={control}
								render={({field: { onChange, onBlur, value }}) => (
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
										value={value}
									/>
								)}
								name="state"
								rules={{ required: true }}
							/>
						</View>						
						<View style={{}}>
							<Text style={s.label}>Zipcode</Text>
							<Controller
								control={control}
								render={({field: { onChange, onBlur, value }}) => (
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
										value={value}
									/>
								)}
								name="zipcode"
								rules={{ required: true }}
							/>
						</View>						

					</View>
					<View style={s.fieldWrapperHalfContainer}>
						<View style={s.fieldWrapperHalf}>
							<Text style={s.label}>Latitude</Text>
							<Controller
								control={control}
								render={({field: { onChange, onBlur, value }}) => (
									<TextInput
										{...register("latitude")}
										keyboardType='numeric'
										style={s.input}
										onBlur={onBlur}
										onChangeText={value => onChange(value)}
										value={value}
									/>
								)}
								name="latitude"
								rules={{ required: true }}
							/>
						</View>
						<View style={s.fieldWrapperHalf}>
							<Text style={s.label}>Longitude</Text>
							<Controller
								control={control}
								render={({field: { onChange, onBlur, value }}) => (
									<TextInput
										style={s.input}
										onBlur={onBlur}
										onChangeText={value => onChange(value)}
										value={value}
									/>
								)}
								name="longitude"
								rules={{ required: true }}
							/>
						</View>
					</View>

				</View>
				<View style={s.formSection}>
					<View style={s.formSectionTitleWrapper}>
						<Text style={s.formSectionTitle}>Images</Text>
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
					    		__useCurrentLocation() 
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
							width: '100%'
						}}
					>
						{previewVisible && capturedImage ? (
							<CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} />
						) : (
							<CameraView
								type={cameraType}
								flashMode={flashMode}
								style={{flex: 1}}
								ref={(r) => {
									camera = r
								}}
							>
								<View
									style={{
										flex: 1,
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
					<View
						style={{
							flex: 1,
							backgroundColor: '#fff',
							justifyContent: 'center',
							alignItems: 'center'
						}}
					>
						<TouchableOpacity
							onPress={__startCamera}
							style={{
								width: 130,
								//borderRadius: 4,
								backgroundColor: '#14274e',
								flexDirection: 'row',
								justifyContent: 'center',
								alignItems: 'center',
								height: 40
							}}
						>
							<Text
								style={{
									color: '#fff',
									fontWeight: 'bold',
									textAlign: 'center'
								}}
							>
								Take picture
							</Text>
						</TouchableOpacity>
						<TouchableOpacity
							onPress={__saveArtifact}
							style={{
								width: 130,
								//borderRadius: 4,
								backgroundColor: '#14274e',
								flexDirection: 'row',
								marginTop: 20,
								justifyContent: 'center',
								alignItems: 'center',
								height: 40
							}}
						>
							<Text
								style={{
									color: '#fff',
									fontWeight: 'bold',
									textAlign: 'center'
								}}
							>
								Save Artifact
							</Text>
						</TouchableOpacity>          
					</View>
				)}
				<Button title="Pick an image from camera roll" onPress={pickImage} />
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
		padding: 30
	},
	image: {
		width: 400,
		height: 300,
		resizeMode: 'cover'
	},  
});

const CameraPreview = ({photo, retakePicture, savePhoto}: any) => {
	console.log('sdsfds', photo)
	return (
		<View
			style={{
				backgroundColor: 'transparent',
				flex: 1,
				width: '100%',
				height: '100%'
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