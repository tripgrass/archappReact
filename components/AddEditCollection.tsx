import axios from 'axios';
import {Alert, FlatList, Image, ImageBackground, Input, Keyboard, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import {CollectionsService}  from '@/utilities/CollectionsService';
import { Asset } from 'expo-asset';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Compressor from 'compressorjs';
import CustomButton from '@/components/Button';
import FilePicker from '@/components/FilePicker';
import FormData from 'form-data';
import CollectionArtifacts from '@/components/CollectionArtifacts';
import Ionicons from '@expo/vector-icons/Ionicons';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import React, { useState, useEffect, useRef, useCallback } from 'react'
import { router, Link,useFocusEffect, useNavigation } from 'expo-router';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import {StatusBar} from 'expo-status-bar'
import { useForm, Controller } from 'react-hook-form';
import { useNavigationState } from '@react-navigation/native';
import { useSession } from '@/utilities/AuthContext';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import _ from "lodash";
import { useIsFocused } from '@react-navigation/native'
import { useAssets } from "expo-asset";
import {ImagesService}  from '@/utilities/ImagesService';
import { AutocompleteDropdown , AutocompleteDropdownContextProvider} from 'react-native-autocomplete-dropdown';

import Constants from 'expo-constants';

const s = require('@/components/style');

let camera: CameraView

export default function AddEditCollection( { initCollectionId, artifactsList, route } ) {
	const isEdit = initCollectionId ? true : false;
	const isFocused = useIsFocused()
	const [origImageIds, setOrigImageIds] = useState([{}]);	
	const [collectionId, setCollectionId] = useState(initCollectionId ? initCollectionId : null);	
	const [collection, setCollection] = useState(null);	
	const [artifacts, setArtifacts] = useState( collection?.artifacts ? collection.artifacts : []);	
	const [galleryImage, setGalleryImage] = useState(null);
	const [loadState, setLoadState] = useState("initial");
	const [saveState, setSaveState] = useState(null);
	const [imageState, setImageState] = useState(null);

	const [previewVisible, setPreviewVisible] = useState(false);	
	const [counterTotal, setCounterTotal] = useState(0);
    const [selectedItem, setSelectedItem] = useState(null);
	const [slideoutState, setslideoutState] = useState('in');
    const [excludedIds, setExcludedIds] = useState( [] );
	const [suggestionsList, setSuggestionsList ] = useState([]);  
	const testCollectionId  = ( Platform.OS == "web" ) ? ( local.collectionId ? local.collectionId : null ) : (route?.params?.params ? route?.params?.params?.collectionId : null);
    const navigation = useNavigation();
	const imageBaseUrl = "https://zkd.b51.mytemp.website/images/";

	const formFields = {
		id:null,
		name : null,
		description: null,
	};
	
	var defaultValues = {};
	const { register, setError, getValues, setFocus, setValue, handleSubmit, control, reset, formState: { errors } } = useForm({
		defaultValues: defaultValues,
	});
	useEffect(() => {
		if( !collectionId && initCollectionId ){
			setCollectionId(initCollectionId);
			setValue('id', initCollectionId);
		}       

	})
	const openSlideout = () => {
		setslideoutState( 'out' );
	}
	const onOpenSuggestionsList = useCallback(isOpened => {
		console.log('IS OPENININGIN');
	}, [])    
	const saveImage = image => {
		setSaveState('savingImage');

		var form = new FormData();
        form.append('collection_id', collectionId);
        if( !collection ){
			form.append('temp', true);
        }
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
	function setupInitialCollection(collection){
		console.log('setupInitialCollection', collection);
		setLoadState("loading");
		artifactImages = [];
		setCollectionId(collection.id);
		setCollection( collection );
		if( collection.artifacts ){
			setArtifacts( collection.artifacts );
		}
		var excludes = [];

		Object.keys(collection.artifacts).forEach((k, i) => {
			excludes.push(collection.artifacts[k].id);
		})	    
		const cloneDeepArtifactsList = _.cloneDeep( artifactsList );
		Object.keys( cloneDeepArtifactsList ).forEach( (k, i) => {
			if( "undefined" != typeof cloneDeepArtifactsList[k] ){
				if( excludes.indexOf( cloneDeepArtifactsList[k].id ) != -1 ){
					cloneDeepArtifactsList.splice(k,1);
				} 
			}
		});
		if( collection.image ){
			collection.image.uri = imageBaseUrl + collection.image.name;
			setGalleryImage( collection.image );
		}
		console.log('galleryImage', galleryImage);
		setSuggestionsList( cloneDeepArtifactsList );
		defaultValues = {};
		Object.keys(formFields).forEach((k, i) => {
			if('null' !== collection[k] ){
				defaultValues[k] = collection[k];
			}
		});		
		reset({ ...defaultValues });
		setCollection(collection);
		setLoadState("loaded");
	}
	useEffect(() => {
		if(isFocused){
			setLoadState("loading");
			console.log('initCollectionId', initCollectionId);
			if( initCollectionId ){
		        CollectionsService({
		        	method:'getById',
		        	id:initCollectionId
		        })
		        .then( result => {
		        	if( result ){
			        	setupInitialCollection(result);
			        } 
		        })
		        .catch( console.log('IN INITIAL EDIT.TSX .error'))
			}
			else{
				setLoadState("loaded");
			}
		}
    }, [isFocused]);         
	const { session, isLoading } = useSession();
 	const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
 	const initialized = useRef(false);
	const { userSession } = useSession();

	const __onCancel = async ( ) => {
		setGalleryImage(null);		
		setLoadState('loading');
		setslideoutState( 'in' );
	    
		const state = navigation.getState();
		const currentIndex = state.index;
		const currentScreen = state.routes[currentIndex].name;
	    if( "edit" == currentScreen ){
	    	navigation.navigate('ProfileTab');
		}
		else{
			router.replace('/');		
		} 
		   
	}
	const onErrors = errors => {
		//console.error(errors);
	}
	const onSubmit = data => {
		setSaveState('saving');
		var form = new FormData();
		var images = [];
		var i = 0;
		
		if( data?.id ){
			form.append('id',data.id);
		}
		form.append('name',data.name);
		form.append('description',data.description);
		var formArtifacts = [];
		Object.keys(artifacts).forEach( (i, item) => {
			formArtifacts.push( artifacts[i].id );
		});
		form.append('artifacts', JSON.stringify(formArtifacts));
		
		if( userSession ){
			var parsedUserSession = JSON.parse(userSession);
			form.append('user_name', parsedUserSession?.user?.name );
			form.append('user_email', parsedUserSession?.user?.email );
		}
        CollectionsService({
		    	method:'create',
		    	url:'collections',
		    	data:form
		    }).then( (results) => {
		    	var newCollection = results;
		    	setSaveState('saved');
		    	setTimeout(function(){
		        	setSaveState(null);
				}, 1000);
			}).catch((error) => {
				console.log('saving error:',error);
				setSaveState(null);
        })				
	};
	const [assets, error] = useAssets( [require('../assets/images/loading.gif'), require('../assets/images/saving.gif')]);
	const loadingIcon = ( assets?.length  ? assets[0] : null );
	const savingIcon = ( assets?.length  ? assets[1] : null );
	const navigateToShow = () => {
		//setLoadState("loading");
		navigation.navigate('show', { params: { collectionId: collectionId } })
	}
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
			base64.assets[0].counter = counter;
			setGalleryImage(base64.assets[0]);
			setPreviewVisible(true);
			setCounterTotal( ( counter + 1 ) );
			saveImage( base64.assets[0] );
			setImageState( base64.assets[0] );
		}    
		else{
		}
	};	
	const removeCollectionImage = () => {
		setGalleryImage(null);
		setSaveState('saving');
		var form = new FormData();		
		form.append('id', collection.id);		
		form.append('detachImage', true);
		

		if( userSession ){
			var parsedUserSession = JSON.parse(userSession);
			form.append('user_name', parsedUserSession?.user?.name );
			form.append('user_email', parsedUserSession?.user?.email );
		}

		var cloneCollection = _.cloneDeep( collection );
		cloneCollection.image_id = null;
		cloneCollection.image = null;
		setCollection( cloneCollection );
        CollectionsService({
		    	method:'create',
		    	url:'collections',
		    	data:form
		    }).then( (results) => {
		    	var newCollection = results;
		    	setSaveState('saved');
		    	setTimeout(function(){
		        	setSaveState(null);
				}, 1000);
			}).catch((error) => {
				console.log('saving error:',error);
				setSaveState(null);
        })				
	}
	const hide = false;
	//const navigation = useNavigation();
	return (
		<>
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
							{ ( collection  && "out" !== slideoutState ) ? (
							
									<Pressable collection={collection}
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

								{ collectionId ? (
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
										title={  collection ? ( saveState == 'savingImage' ? "Saving" : "Update") : "Save" }
										onPress={ ( saveState == 'savingImage')  ? null : handleSubmit(onSubmit, onErrors) }/>
										</>
									) : (null)
								}

					</View>
				</View>	
			) : null }		
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
			<CollectionArtifacts suggestionsList={suggestionsList} setSuggestionsList={setSuggestionsList} artifacts={artifacts} setArtifacts={setArtifacts} artifactsList={ artifactsList } slideoutState={slideoutState} setslideoutState={setslideoutState} ></CollectionArtifacts>
			) : (																	
						
			<ScrollView 
				style={[s.mainContainer,{zIndex:-1}]} 
				contentContainerStyle={[s.mainContentContainer]}
			>										
				<View style={[s.formOuterWrapper,{paddingTop:128}]}>

					<View style={s.formWrapper}>
						<View style={s.formSection}>
							<View style={[s.fieldsWrapperContainer,{flex:1, backgroundColor:'', flexDirection:'column'}]}>
								
								<View style={s.fieldsWrapper}>
									<View style={[{width:'100%', backgroundColor:''}]}>
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
								<View style={[s.fieldsWrapper,{backgroundColor:'', flexDirection:'row', marginTop:20, marginBottom:30}]}>
									<Text style={[s.formSectionTitle,{flex:1,backgroundColor:'', fontSize:22, fontWeight:500,marginTop:14}]}>Artifacts {(artifacts.length > 0 ) ? (<>({artifacts.length})</>): null }</Text>
									<CustomButton
											//linkStyle={true}
											styles={{
												flex:1,
												color:'black',
												marginLeft: 'auto',
											}}						
											title={ (artifacts.length > 0 ) ? "Manage Artifacts" : "Add Artifact" }
											onPress={ () => { openSlideout() }}
										/>

								</View>
								<View style={[s.fieldsWrapper,{ flexDirection:'row'}]}>

									<Text style={s.formSectionTitle}>Image</Text>
									{ collectionId ? (
									<>
									{ (Platform.OS == 'web') ? (<FilePicker onChange={handleFileChange}></FilePicker>) : null }
									{( Platform.OS !== "web" && ( !galleryImage) ) ? (
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
									</>) : null }						
									</> ) : null }

								</View> 
								<View style={s.fieldsWrapper}>


									{galleryImage ? (
										<View style={{position:'relative', marginRight:15}}>

											<Text>"null"</Text>
											<Image source={{uri:galleryImage.uri}} /* Use item to set the image source */
											style={{
												width:150,
												height:150,
												backgroundColor:'#d0d0d0',
												//resizeMode:'contain',
											}}
										/>
										{ galleryImage ? (									
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
												top:-7,
												left:-7,
												elevation: 3,
												marginRight:5,
												boxShadow: '0px 2px 2px #d8d8d8'						        
														}
										]}
											onPress={ () => { 
												removeCollectionImage();
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
									): (null) }										
										</View>
										) : 
									(									
									<View style={[s.iconWrapper,{flex:1, flexDirection:'row',maxWidth:'1100px', alignItems: 'center'}]}>  
										<Ionicons name="image-outline" size={70} color="#d8d8d8" style={{display:'flex'}}/>						
									</View>)}
								</View>
								<View style={[s.fieldsWrapper,{flex:1, backgroundColor:''}]}>
									<View style={[{width:'100%', flex:1,flexDirection:'row', marginBottom:5}]}>
										<Text style={s.label}>Description</Text>
										<Text style={{color:'red', marginLeft:'0'}}>
											{errors.description && errors.description.message }
										</Text>
									</View>

									<Controller
										name="description"
										control={control}
										render={({field: { onChange, onBlur, value="" }}) => (
											<TextInput 
											    style={[s.input,{
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
								<StatusBar style={{display:'block'}} />							
	            			</View>
	            			</View>
	            			</View>
	            			</View>
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

