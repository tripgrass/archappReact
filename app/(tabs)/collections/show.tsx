import  CollectionView  from '@/components/CollectionView';

import { FlatList, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import  {CollectionsService}  from '@/utilities/CollectionsService';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';
import { useIsFocused } from '@react-navigation/native'
import Constants from 'expo-constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Asset, useAssets } from 'expo-asset';

function ShowCollection({ route, navigation }) {
	const [collection, setCollection] = useState(null);	
	const [loadState, setLoadState] = useState('loading');	
	const isFocused = useIsFocused()
	const local = useLocalSearchParams();
	const collectionId  = ( Platform.OS == "web" ) ? ( local.collectionId ? local.collectionId : null ) : (route?.params?.params ? route?.params?.params?.collectionId : null);

	const [galleryImages, setGalleryImages] = useState([]);
	const imageBaseUrl = "https://zkd.b51.mytemp.website/images/";
	const [assets, error] = useAssets( [require('../../../assets/images/loading.gif'), require('../../../assets/images/saving.gif')]);
	const loadingIcon = ( assets?.length  ? assets[0] : null );


	function setup(result){
		setCollection(result);
		setGalleryImages(result.images);
		setLoadState('loaded');
	}
	console.log('collectionId', collectionId);
	useEffect(() => {
		 if(isFocused){
			setLoadState('loading');
			if( collectionId ){
		        CollectionsService({
		        	method:'getById',
		        	id:collectionId
		        })
		        .then( (results) => {
		        	console.log('show get results collections', results);
		        	console.log('show get results collection artifacts[0]', results.artifacts[0].location.coordinates[0]);
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
					<CollectionView setLoadState={setLoadState} route={route} collection={collection} navigation={navigation} galleryImages={galleryImages} setGalleryImages={setGalleryImages}></CollectionView>
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
export default ShowCollection;