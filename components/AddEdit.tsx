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
import { useAssets } from "expo-asset";
import {PersonsService}  from '@/utilities/PersonsService';
import {ImagesService}  from '@/utilities/ImagesService';

import Constants from 'expo-constants';

const s = require('@/components/style');

let camera: CameraView

export default function AddEdit( { initArtifactId, collectionId, setCollectionId } ) {
console.log('addedit artifactId', initArtifactId);
	const isEdit = initArtifactId ? true : false;
	const isFocused = useIsFocused()
	const [origImageIds, setOrigImageIds] = useState([{}]);	
	const [artifactId, setArtifactId] = useState(initArtifactId ? initArtifactId : null);	
	const [artifact, setArtifact] = useState(null);	
	const [collections, setCollections] = useState([]);	
	const [galleryImages, setGalleryImages] = useState([]);
	const [loadState, setLoadState] = useState("initial");
	const [saveState, setSaveState] = useState(null);
	const [photographers, setPhotographers] = useState();
	const [counterTotal, setCounterTotal] = useState(0);
	    const navigation = useNavigation();

	const formFields = {
		id:null,
		name : null,
		initial_year : null,
		description: null,
		title: null,
		address:null,
		city:null,
		state:null,
		zipcode:null
	};
	var artifactImages = [];
	const imageBaseUrl = "https://zkd.b51.mytemp.website/images/";
	
	const pageTitle = null;//!artifact ? 'Add an Artifact' : 'Edit ' + artifact.name;
	const [fillLocationMode, setFillLocationMode] = useState('Manually Fill');
	const [locationLookupState, setlocationLookupState] = useState('initial');
	var defaultValues = {};
	const { register, setError, getValues, setFocus, setValue, handleSubmit, control, reset, formState: { errors } } = useForm({
		defaultValues: defaultValues,
	});
	useEffect(() => {
		if( !artifactId && initArtifactId ){
			setArtifactId(initArtifactId);
			setValue('id', initArtifactId);
		}       
    })
	function getGrade( key ){
		const gradeMapRev = {
			1: "Prevailing",
			5 : "Meaningful",
			10: "Vital"
		};		
		const gradeMap = {
			Prevailing : 1,
			Meaningful : 5,
			Vital : 10
		};
		if( typeof key === 'number' ){
			return gradeMapRev[key];
		}
		else{
			return gradeMap[key];
		}

	}
	function getPhotographers(){
		data = {
			"personas" : [
				"Photographer"
			]
		};
        PersonsService({
                method:'getAll',
                data:data
            })
            .then( result => {
                console.log('photogrpahers result', result);
	const suggestions = result
	      .map(item => ({
	        id: item.id,
	        title: item.firstname + " " + item.lastname,
	      }))
         	setPhotographers(suggestions);
        })
            .catch((error) => {
            console.log('!!!!!!!!!!!!!!! error:',error);
        }); 

	}
	function setupInitialArtifact(artifact){
		setLoadState("loading");
		artifactImages = [];
console.log('setu[ artfact', artifact);
		setArtifactId(artifact.id);
//				setValue('latitude', JSON.stringify(latitude) );
		if( (artifact.scale && "null" != artifact.scale) ){
			setScale(artifact.scale);
		}
		else{
			setScale(1);
		}
		if( (artifact.grade && "null" != artifact.grade && "undefined" != artifact.grade) ){
			//gradeVal = getGrade(artifact.grade);
			console.log('artifact grade !!!!!!!!!!!!!!!!!!!!!', artifact.grade);
			//alert(artifact.grade);
			setGrade( artifact.grade );
			//setGrade(1);
		}
		else{
			setGrade(1);
		}	
		console.log('after set Grade:', grade);	
		setArtifact( artifact );
		if( artifact.collections ){
			setCollections( artifact.collections );
		}
//		setScale( (artifact.scale && "null" != artifact.scale) ? artifact.scale : 1 );
	//	setScale( 1);
		defaultValues = {};
		Object.keys(formFields).forEach((k, i) => {
			if('null' !== artifact[k] ){
				// api is returing null as string  - should clean that up at the api
				defaultValues[k] = artifact[k];
			}
		});
		defaultValues.latitude = JSON.stringify(artifact?.latitude);
		defaultValues.longitude = JSON.stringify(artifact?.longitude);
		if( defaultValues.latitude && defaultValues.longitude && defaultValues.address ){
			setlocationLookupState('loaded')
		}
		if('undefined' != typeof artifact && 'undefined' != typeof artifact?.images){
			var counter = counterTotal;

			var imageIds = [];
			Object.keys(artifact.images).forEach((k, i) => {
				var thisImage = {
					id:artifact.images[k].id,
					fileName:artifact.images[k].name,
					year:artifact.images[k].year,
					title:artifact.images[k].title,
					alttext:artifact.images[k].alttext,
					person_id:artifact.images[k].person_id,
					uri:imageBaseUrl + artifact.images[k].name
				};
				console.log('this image', thisImage);
				thisImage.counter = counter;
				artifactImages[counter] =  thisImage;
				imageIds.push(artifact.images[k].id);
				counter++;
			});
			setCounterTotal(counter);
			console.log('artifactImages line 149', artifactImages);
			if( !origImageIds[artifact.id] ){
				var newOrigImages = _.cloneDeep(origImageIds);
				newOrigImages[artifact.id] = imageIds;
				setOrigImageIds(newOrigImages);
			}
			else{
				setOrigImageIds([artifact.id = []]);				
			}

			if( artifactImages.length > 0 ){
				console.log('artifactImages line 160', artifactImages);
				setGalleryImages(artifactImages);		
				defaultValues.images = artifactImages;
			}
			else{
				setGalleryImages([]);		
				defaultValues.images = [{}];				
			}
		}
		else{
			setGalleryImages([]);		
			defaultValues.images = [{}];				
		}
		reset({ ...defaultValues });
		setArtifact(artifact);
		setLoadState("loaded");
	}
	useEffect(() => {
		if( !photographers ){
			getPhotographers();
		}
		if(isFocused){

			setLoadState("loading");
			if( initArtifactId ){
				console.log('LOOKING VIA API FOR ARTIFACT');
		        ArtifactsService({
		        	method:'getById',
		        	id:initArtifactId
		        })
		        .then( result => setupInitialArtifact(result) )
		        .catch( console.log('IN INITIAL EDIT.TSX .error'))
			}
			else{
				setLoadState("loaded");
			}
		}
    }, [isFocused]);         
	const [image, setImage] = useState<string | null>(null);
//	const [scale, setScale] = useState(artifact?.scale ? artifact?.scale : 1);
	const [scale, setScale] = useState(1);
	const [grade, setGrade] = useState( 1 );
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
 	const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
 	const initialized = useRef(false);
	const [startCamera, setStartCamera] = useState(false)
	const [imageMetaState, setImageMetaState] = useState('closed');

	const { userSession } = useSession();

	const getLocationData = async () => {
		fillLocationModeVal = await AsyncStorage.getItem('fillLocationMode');
		setFillLocationMode(fillLocationModeVal);
		if('Autofill Current Location' == fillLocationModeVal ){
			__useCurrentLocation('loaded');
		}
	};
	if( Platform.OS !== "web" ){
		useEffect( () => {
			if (!initialized.current && !artifactId ) {
				getLocationData();  
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
	const openSlideout = imageItem => {
		setslideoutState( 'out' );
		console.log('imageItem', imageItem);
		setImageState( imageItem );
	}
	const __onCancel = async ( ) => {
		setGalleryImages([]);		
		setLoadState('loading');
		setslideoutState( 'in' );
//		router.back();
//					router.replace('/');		

/*
		navigation.navigate('edit', {
	        params: { artifactId: artifactId }
	    })
	    */
	    
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
	const onErrors = errors => {
		//console.error(errors);
	}
	const onSubmitVoid = data => {
		console.log('test');
		console.log('origImageIds:' , origImageIds);
		console.log('data', data);
		console.log('galleryImages', galleryImages);
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
	const saveImage = image => {
console.log('saveImage data', image );
		setSaveState('savingImage');
		var form = new FormData();
        form.append('artifact_id', artifactId);
        if( !artifact ){
			form.append('temp', true);
        }
		imageMeta = {};
		form.append('imagesMeta[0]', JSON.stringify( image ) );
		if( Platform.OS == "web" ){
			form.append('source', 'web');
			form.append('images[0]', image );
		}
		else{
			form.append('source','phone');
			const uri =
			( Platform.OS === "android" || Platform.OS === "web" )
				? image.uri
				: image.uri.replace("file://", "");
			const filename = image.uri.split("/").pop();
			console.log('adding filename:', filename);
			const match = /\.(\w+)$/.exec(filename as string);
			const ext = match?.[1];
			const type = match ? `image/${match[1]}` : `image`;
			form.append('images[0]', {
				uri,
				name: `image.${ext}`,
				type,
			} as any);

		} 	
		ImagesService({
                method:'create',
                data:form
            })
            .then( result => {
                console.log('image save result',result);
				setSaveState(null);


            }).catch((error) => {
                console.log('saving error:',error);
				setSaveState(null);
            })  			
	}
	const onSubmit = data => {
		setSaveState('saving');
		console.log('saveState', saveState);
		console.log('data', data);
		var form = new FormData();
		form.append('temp', false);
		var images = [];
		var i = 0;
		/*
		console.log('galleryImages', galleryImages);
		galleryImages.forEach(selectedImage => {
			//console.log('artifactId', artifactId);
		//	console.log('artifact.id', artifact.id);
			console.log('origImageIds', origImageIds);
			console.log('seleectedImage', selectedImage);
			if( artifact?.id && "undefined" == typeof origImageIds[artifact.id] ){
				origImageIds[artifact.id] = [];
			}
			if( ( artifact?.id && !origImageIds[artifact.id].includes( selectedImage.id ) ) || !artifact?.id){
				imageMeta = {};
				imageMeta.year = selectedImage.year;				
				imageMeta.person_id = selectedImage.person_id;				
				imageMeta.isPrimary = selectedImage.isPrimary;				
				imageMeta.title = selectedImage.title;
				console.log('imagesMeta', imageMeta);				
				form.append('imagesMeta[' + i + ']', JSON.stringify(imageMeta) );
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
					console.log('adding filename:', filename);
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
		*/
		if( isEdit && data?.id ){
			form.append('id',data.id);
		}
		form.append('name',data.name);
		form.append('address', data.address);
		form.append('city', data.city);
		form.append('state',data.state);
		form.append('zipcode',data.zipcode);					
		form.append('latitude',data.latitude);
		form.append('longitude',data.longitude);
		form.append('initial_year',data.initial_year);
		form.append('scale',scale);		
		form.append('grade',grade);
		form.append('description',data.description);
		
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
            	var newArtifact = results;
            	console.log('newartifact ',newArtifact);
            	if( "undefined" != typeof newArtifact.images){
	            	setGalleryImages(newArtifact.images);
	            }
            	setArtifact(newArtifact);
            	setArtifactId(newArtifact.id);
            	setupInitialArtifact(newArtifact);
            	setSaveState('saved');

            	setTimeout(function(){
	            	setSaveState(null);
			}, 1000);
		    	//navigation.navigate('ProfileTab');
		}).catch((error) => {
			console.log('saving error:',error);
			setSaveState(null);
            })				
	};
	const [assets, error] = useAssets( [require('../assets/images/loading.gif'), require('../assets/images/saving.gif')]);
	const loadingIcon = ( assets?.length  ? assets[0] : null );
	const savingIcon = ( assets?.length  ? assets[1] : null );
	const handleToggle = ( event ) => { 
		setSelectedIndex( event.nativeEvent.selectedSegmentIndex); 
	};
	const __clearLocation = async () => {
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
		console.log('geo status', status);
		if (status !== "granted") {
			return;
		}
		try {
			let location = await Location.getCurrentPositionAsync({});
			var latitude = location.coords.latitude;
			var longitude = location.coords.longitude;
			setValue('latitude', JSON.stringify(latitude) );
			setValue('longitude', JSON.stringify(longitude) );	
			reverseCoordinateLookup(latitude, longitude);	
			if(lookupState ){
				setlocationLookupState( lookupState );
			}
		} catch (exceptionVar) {
			console.log('exceptionVar', exceptionVar);
		}
	}
	const navigateToShow = () => {
		//console.log('------------->view navigate artifact.id',artifact.id);
		//console.log('------------->view navigate artifactId',artifactId);
		setLoadState("loading");
		navigation.navigate('show', { params: { artifactId: artifactId } })
	}
	const handleFileChange = event => {
		const fileObj = event.target.files && event.target.files[0];
		if (!fileObj) {
			return;
		}
		//console.log('fileObj is', fileObj);
		event.target.value = null;
		fileObj.uri = URL.createObjectURL(fileObj);
		const cloneDeep = _.cloneDeep(galleryImages);
		cloneDeep.push(fileObj);
		console.log('setgalelryimages in handflefilechange', cloneDeep);
		setGalleryImages( cloneDeep );
		setPreviewVisible(true)
	};
	const removeArtifactImage = data => {
        var form = new FormData();
        form.append('artifact_id', (artifactId ? artifactId : null));
        if( imageState?.id ){
            // you're editing an existing db image 
            form.append('id',imageState.id);
            ImagesService({
                method:'delete',
                artifact_id:artifactId,
                id:imageState?.id
            })
            .then( result => {
                console.log(result);
                const cloneDeep = _.cloneDeep(galleryImages);
                Object.keys(cloneDeep).forEach((k, i) => {
                    if( imageState?.id  == cloneDeep[k].id ){
                        cloneDeep.splice(k);
                    }
                });  
                console.log('remove image clonedeep update:', cloneDeep);          
                setGalleryImages( cloneDeep );         

            }).catch((error) => {
                console.log('saving error:',error);
            })              
        }
        else{

        }
        console.log('DE;ETE');
    };   
	const __pickImage = async () => {
		let  base64  = await ImagePicker.launchImageLibraryAsync({
			mediaTypes: ImagePicker.MediaTypeOptions.All,
			base64: false,
			allowsEditing: true,
			aspect: [4, 3],
			quality: 1
	      });
	      const counter = counterTotal;
		if (base64 && base64?.assets ) {
			console.log('PICKIMAGE SUCCESS galleryImages', galleryImages);
//			galleryImages.push(result.assets[0]);
//						galleryImages.push(uri);
			const cloneDeep = _.cloneDeep(galleryImages);
			base64.assets[0].counter = counter;
			cloneDeep.push(base64.assets[0]);
			console.log('set galleryImages in pickimage', cloneDeep);

			setGalleryImages( cloneDeep );
			setPreviewVisible(true);
			setCounterTotal( ( counter + 1 ) );
			saveImage( base64.assets[0] );
			setImageState( base64.assets[0] );
			console.log('imagestate in pickimage!!!!!!!!!!!!!!', imageState);
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

				setStartCamera(true)
			if (!permission.granted) {
				// Camera permissions are not granted yet.
//				alert('not granted');
			}    
			else{
//				setStartCamera(true)
			}
	}
	const __removePhoto = () => {
	}
	
	
	
	const hide = false;
	//const navigation = useNavigation();
	
	return (
		<>
			<CameraWrapper galleryState={galleryImages} stateChanger={setGalleryImages} cameraState={startCamera} setCameraState={setStartCamera} artifact={artifact} artifactId={artifactId}></CameraWrapper>		
			{ ( "loaded" == loadState ) ? (										

				<View style={[s.formButtonSection,{
						paddingTop:50,
						backgroundColor:'rgba(255,255,255,1)',
						elevation:2,
						zIndex: ("out" == slideoutState) ? -1 : 999,
						padding:0,
						position:'absolute',
					}
						
					]}>
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
							{ ( artifact  && "out" !== slideoutState ) ? (
							
									<Pressable artifact={artifact}
										style={({pressed}) => [
														{
												backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
										alignItems: 'center',
										justifyContent: 'center',
										borderRadius: 20,
										height:40,
										marginTop:10,
										width:40,
										marginLeft:10,
										elevation: 3,
										marginRight:10,
										boxShadow: '0px 2px 2px #d8d8d8'						        
														}
										]}
										onPress={ () => { navigateToShow() }}
									>
										<Ionicons name="eye-outline" size={30} color="" style={{
											display:'flex-inline',
											height:30,
											width:30,
											borderRadius:16,								
								}}/>
									</Pressable> 
										
						) : null }										

								{ artifactId ? (
									<>
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
											marginLeft: 20,					    		
										}}						
										textStyles={{
											color:( saveState == 'savingImage'  ? '#d8d8d8' : 'black' ),
										}}
										title={  artifact ? ( saveState == 'savingImage' ? "Saving" : "Update") : "Save" }
										onPress={ ( saveState == 'savingImage')  ? null : handleSubmit(onSubmit, onErrors) }/>
										</>
									) : (null)
								}

					</View>
				</View>	
			) : null }				

						{ "loaded" != loadState ? (										
						<View style={{
							zIndex:99999, display:'block',position:'absolute',top:0, bottom:0,paddingBottom:50,width:'100%',
							backgroundColor:'white', justifyContent:'center', flex:1, alignItems:'center'}}
						>					
							<Image source={ loadingIcon } /* Use item to set the image source */
			                            style={{
			                                width:150,
			                                height:150,
			                            }}
			                        />  
						</View>
						) : ( null ) }
						{ ("saving" == saveState )? (										
							<View style={{
								zIndex:99999, display:'block',position:'absolute',top:0, bottom:0,paddingBottom:50,width:'100%',
								backgroundColor:'rgba(0,0,0,.7)', justifyContent:'center', flex:1, alignItems:'center'}}
							>							
								<Image source={ savingIcon } /* Use item to set the image source */
				                            style={{
				                                width:150,
				                                height:150,
				                            }}
				                        />  
				                        <Text
				                        	style={{
				                        		color:'white',
				                        		marginTop:20,
				                        		fontSize:20,
				                        		fontWeight:'bold'
				                        	}}
				                        >Saving...</Text>
							</View>
						) : ( null ) }											
						{ ("saved" == saveState )? (										
							<View style={{
								zIndex:99999, display:'block',position:'absolute',top:0, bottom:0,paddingBottom:50,width:'100%',
								backgroundColor:'rgba(255,255,255,.8)', justifyContent:'center', flex:1, alignItems:'center'}}
							>							
				                        <Text
				                        	style={{
				                        		marginTop:20,
				                        		fontSize:20,
				                        		fontWeight:'bold'
				                        	}}
				                        >Saved!</Text>
							</View>
						) : ( null ) }
										
{ ( "out" == slideoutState ) ? (
			<ImageMeta photographers={photographers} galleryState={galleryImages} galleryStateChanger={setGalleryImages} artifactId={artifactId} artifactPrimaryImageId={ artifact ? artifact.primary_image_id : null } slideoutState={slideoutState} setslideoutState={setslideoutState} imageState={imageState} setImageState={setImageState}></ImageMeta>
			) : (																	

			<ScrollView 
				style={[s.mainContainer,{zIndex:-1}]} 
				contentContainerStyle={[s.mainContentContainer]}
			>
				<View style={[s.formOuterWrapper,{paddingTop:128,minHeight:'100vh'}]}>

					<View style={s.formWrapper}>
						<View style={s.formSection}>
						<View style={s.fieldsWrapperContainer}>
								<View style={s.fieldsWrapper}>
									<View style={[s.label,{width:'100%', flex:1,flexDirection:'row'}]}>

										<Text style={s.label}>Name</Text>
										<Text style={{color:'red', marginLeft:'auto'}}>
											{errors.name && errors.name.message }
										</Text>
									</View>
									<Controller
										control={control}
										name="name"
										rules={{ required: "*" }}
										render={({field: { onChange, onBlur, value }}) => (
											<TextInput
												style={[s.input, errors.name ? s.inputError : null ]}	
												onBlur={onBlur}
												onChangeText={value => onChange(value)}
												value={(value) ? value : ""}
											/>
										)}
									/>
								</View>
								<View style={[s.fieldWrapper,{minWidth:'18%'}]}>
									<View style={[s.label,{width:'', flex:1,flexDirection:'row'}]}>

										<Text style={s.label}>Year</Text>
										<Text style={{color:'red', marginLeft:'auto'}}>
											{errors.name && errors.name.message }
										</Text>
									</View>
										<Controller
											control={control}
											name="initial_year"
											render={({field: { onChange, onBlur, value="" }}) => (
												<TextInput
													style={[s.input, errors.initial_year ? s.inputError : null,{maxWidth:'100%'} ]}
													onBlur={onBlur}
													onChangeText={value => onChange(value)}
													value={(value) ? value : ""}
												/>
											)}
										/>	  						
								</View>
							</View>	
						</View>	

						<View style={[s.formSection, {marginTop:15}]}>
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
						<View style={[s.formSection, {marginTop:10}]}>
							<View style={s.fieldWrapperHalf}>
								<Text style={s.label}>Grade</Text>

								<SegmentedControl
									name='grade'
									values={['Prevailing', 'Meaningful', 'Vital']}
									selectedIndex={grade}
									onChange={(event) => { setGrade(event.nativeEvent.selectedSegmentIndex) }}
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
											console.log('pressed LOC button');
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
								<View style={[s.label,{width:'100%', flex:1,flexDirection:'row'}]}>
									<Text style={s.label}>Address</Text>
									<Text style={{color:'red', marginLeft:'auto'}}>
										{errors.address && errors.address.message }
									</Text>
								</View>
								<Controller
									control={control}
									rules={{ required: "*" }}									
									name="address"									
									render={({
										field: { onChange, onBlur, value, name, ref },
										fieldState: { invalid, isTouched, isDirty, error },
										formState
									}) => (
										<TextInput
											style={[s.input, errors.address ? s.inputError : null ]}										
											onBlur={onBlur}
											onChangeText={value => onChange(value)}
											value={(value) ? value : ""}
										/>
									)}
								/>								
							</View>
							<View style={s.fieldsWrapperContainer}>
								<View style={s.fieldsWrapper}>
									<View style={[s.label,{width:'100%', flex:1,flexDirection:'row'}]}>
										<Text style={s.label}>City</Text>
										<Text style={{color:'red', marginLeft:'auto'}}>
											{errors.city && errors.city.message }
										</Text>
									</View>
									<Controller
										name="city"
										rules={{ required: "*" }}
										control={control}
										render={({field: { onChange, onBlur, value="" }}) => (
											<TextInput
												style={[s.input, errors.city ? s.inputError : null ]}
												onBlur={onBlur}
												onChangeText={value => onChange(value)}
												value={(value) ? value : ""}
												error={Boolean(errors.city)}
        											helperText={errors.city ? errors.city.message : ""}
											/>
										)}
									/>																	
								</View>
								<View style={{}}>
									<View style={[s.label,{width:'100', flex:1,flexDirection:'row'}]}>
										<Text style={s.label}>State</Text>
										<Text style={{color:'red', marginLeft:'auto'}}>
											{errors.state && errors.state.message }
										</Text>
									</View>
									<Controller
										name="state"
										rules={{ required: "*" }}										
										control={control}
										render={({field: { onChange, onBlur, value="" }}) => (
										<TextInput
												style={[s.input, errors.state ? s.inputError : null ]}
												onBlur={onBlur}
												onChangeText={value => onChange(value)}
												value={(value) ? value : ""}
											/>
										)}
									/>
								</View>						
								<View style={{}}>
									<View style={[s.label,{width:'100', flex:1,flexDirection:'row'}]}>
										<Text style={s.label}>Zip</Text>
										<Text style={{color:'red', marginLeft:'auto'}}>
											{errors.zipcode && errors.zipcode.message }
										</Text>
									</View>

									<Controller
										control={control}
										name="zipcode"
										rules={{ required: "*" }}																				
										render={({field: { onChange, onBlur, value="" }}) => (
											<TextInput
												style={[s.input, errors.zipcode ? s.inputError : null ]}
												onBlur={onBlur}
												onChangeText={value => onChange(value)}
												value={(value) ? value : ""}
											/>
										)}
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
									{ artifactId ? (
										<>
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
								</> ) : null }
							</View> 
						</View>
						<View style={{flex:1 }}>
							{galleryImages && galleryImages.length > 0 ? (
								<FlatList
									contentContainerStyle={{ flexGrow:1,paddingTop:20, marginRight:'auto', paddingLeft:20}}
									horizontal={true} 
									showsHorizontalScrollIndicator={true} 
									data={galleryImages}
									extraData={galleryImages}
									keyExtractor={(item, index) => {return  index.toString();}}
									renderItem={ ({ item, index }) => (
										( "undefined" != typeof item ) ? (
										<View key={item.id} serverId={item.id} style={{position:'relative', marginRight:15}}>
										{ "savingImage" == saveState && item?.id == imageState?.id ? (										
											<View style={{
												zIndex:99999, width:150, position:'absolute',
												backgroundColor:'rgba(0,0,0, .3)', justifyContent:'center', flex:1, alignItems:'center'}}
											>					
												<Image source={ loadingIcon } /* Use item to set the image source */
								                            style={{
								                                width:150,
								                                height:150,
								                            }}
								                        />  
											</View>
											) : ( null ) 
										}
										<Image source={{uri:item.uri}} /* Use item to set the image source */
											style={{
												width:150,
												height:150,
												backgroundColor:'#d0d0d0',
												//resizeMode:'contain',
											}}
										/>
										{ "savingImage" == saveState && item?.id == imageState?.id ? (null) :(									
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
													position:'absolute',
													top:-14,
													right:-14,
													elevation: 4,
													marginRight:5,
													boxShadow: '0px 2px 2px #d8d8d8'						        
															}
											]}
											onPress={ () => { 
												openSlideout(item);
											}}
										>
										<Ionicons name="pencil-outline" size={25} color="" style={{
													display:'flex-inline',
													height:25,
													width:25,
													borderRadius:12,								
										}}/>
										</Pressable>
										<Pressable 
										style={({pressed}) => [
														{
															display:'none',
												backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
												alignItems: 'center',
												justifyContent: 'center',
												borderRadius: 20,
												height:40,
												//borderColor:'red',
												//borderWidth:1,
												width:40,
												position:'absolute',
												top:-7,
												left:-7,
												elevation: 3,
												marginRight:5,
												boxShadow: '0px 2px 2px #d8d8d8'						        
														}
										]}
											onPress={ () => { 
												removeArtifactImage(item);
											}}
									>
										<Ionicons name="close-outline" size={30} color="" style={{
													display:'flex-inline',
													height:30,
													width:30,
													borderRadius:16,								
										}}/>
										</Pressable>
									</>
									) }
									</View> ) : (null)
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
						<View style={s.formSection}>
							<View style={s.formSectionTitleWrapper}>
								<Text style={s.formSectionTitle}>Description</Text>
							</View>

						</View>		

						<View style={s.formSection}>
							<View style={s.fieldWrapper}>
								<View style={[{width:'100%', flex:1,flexDirection:'row'}]}>
									<Text style={{color:'red', marginLeft:'auto'}}>
										{errors.description && errors.description.message }
									</Text>
								</View>

								<Controller
									name="description"
									control={control}
									render={({field: { onChange, onBlur, value="" }}) => (
										<TextInput 
										    style={[s.input,{
										        flex:1,
										        minHeight:100,
										        textAlignVertical:'top',
										        justifyContent: "flex-start", 
										        backgroundColor: 'white' 
										    }]} 
										placeholder="" 
										onBlur={onBlur}
										onChangeText={value => onChange(value)}
										value={value}
										multiline={true} 
										/>								
									)}
								/>


	                            						
							</View>
						</View>
						<View style={[s.formSection,{marginTop:5}]}>
							<View style={s.formSectionTitleWrapper}>
								<Text style={s.formSectionTitle}>Collections</Text>
							</View>
						</View>
						<View style={s.formSection}>

							<View style={s.fieldWrapper}>
								<View style={[{width:'100%', flex:1,flexDirection:'row'}]}>
									<Text style={{color:'red', marginLeft:'auto'}}>
										{errors.description && errors.description.message }
									</Text>
								</View>

								<View style={{ display:'block',flex:1,zIndex:-1, backgroundColor:'', marginTop:10}}>
									{Object.keys(collections).map((i, item) => (
    									<View key={i} style={{ backgroundColor:'', maxWidth:'1200px', margin:'0 auto', display:'flex', flexWrap:'wrap',flexDirection:'row',width:'100%', alignItems:'center', marginTop:8}}>
	                                		<Text style={[ {width:'30%',flexGrow: 1}]}>{ collections[i].id} - {i}add owner</Text>
			                                <CustomButton
			                                    webbable={true}
			                                    styles={{marginRight:5, paddingHorizontal: 14 }}
			                                    title="Edit"
			                                    onPress={ () => {
			                                    	//alert(1);
			//navigation.navigate('EditCollection') ;
													setCollectionId(collections[i].id);
													navigation.navigate('EditCollection', {
			                                            params: { collectionId: collections[i].id }

			                                        }) 
													
			                                    }}
			                                />                            
    		                        	</View>
									))}								
                       
                    			</View> 	                            						
							</View>
						</View>						

					</View> 				
				</View>
											

				<StatusBar style={{display:'block'}} />			
							
			</ScrollView>
		 ) }

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

