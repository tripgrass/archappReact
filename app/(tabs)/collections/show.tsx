import  ArtifactView  from '@/components/ArtifactView';

import { FlatList, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import  {ArtifactsService}  from '@/utilities/ArtifactsService';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';
import { useIsFocused } from '@react-navigation/native'
import Constants from 'expo-constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Asset, useAssets } from 'expo-asset';

function ShowArtifact({ route, navigation }) {
	const [artifact, setArtifact] = useState(null);	
	const [loadState, setLoadState] = useState('loading');	
	const isFocused = useIsFocused()
	const local = useLocalSearchParams();
	const artifactId  = ( Platform.OS == "web" ) ? ( local.artifactId ? local.artifactId : null ) : (route?.params?.params ? route?.params?.params?.artifactId : null);

	const [artifacts, setArtifacts] = useState([]);
	const [galleryImages, setGalleryImages] = useState([]);
	const imageBaseUrl = "https://zkd.b51.mytemp.website/images/";
	const [assets, error] = useAssets( [require('../../../assets/images/loading.gif'), require('../../../assets/images/saving.gif')]);
	const loadingIcon = ( assets?.length  ? assets[0] : null );


	function setup(result){
		setArtifact(result);
		setGalleryImages(result.images);
		setLoadState('loaded');
	}
	useEffect(() => {
		 if(isFocused){
			setLoadState('loading');
			if( artifactId ){
		        ArtifactsService({
		        	method:'getById',
		        	id:artifactId
		        })
		        .then( (results) => {
		        	console.log('show get results', results);
		        	if( Array.isArray( results ) ){
		        		setup(results[0]);
		        	}
		        	else{
			        	setup(results);
			        }
		        })
				.catch((error) => {
                	console.log(error);
            	});
			}
		}
    }, [isFocused]);    

    return (
    	<>
			{ 'loading' == loadState ? (
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

			) : (
				<View style={viewStyles.container}>
					<ArtifactView setLoadState={setLoadState} route={route} artifact={artifact} navigation={navigation} galleryImages={galleryImages} setGalleryImages={setGalleryImages}></ArtifactView>
	 			</View>
			) }
		</>
    );
}

const viewStyles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent:'center',
		alignItems:'center',
		padding: 16

	}
});
export default ShowArtifact;