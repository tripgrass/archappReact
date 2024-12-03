import  ArtifactView  from '@/components/ArtifactView';

import { FlatList, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import  {ArtifactsService}  from '@/utilities/ArtifactsService';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';
import { useIsFocused } from '@react-navigation/native'
import Constants from 'expo-constants';
import Ionicons from '@expo/vector-icons/Ionicons';

function ShowArtifact({ route, navigation }) {
	const [artifact, setArtifact] = useState(null);	
	const [loadState, setLoadState] = useState('loading');	
	const isFocused = useIsFocused()
	const local = useLocalSearchParams();
	const artifactId  = ( Platform.OS == "web" ) ? ( local.artifactId ? local.artifactId : null ) : (route?.params?.params ? route?.params?.params?.artifactId : null);

//	console.log('show artifact===============', artifact);
	const [artifacts, setArtifacts] = useState([]);
	const [galleryImages, setGalleryImages] = useState([]);
	const imageBaseUrl = "https://zkd.b51.mytemp.website/images/";

	const navigateToEdit = () => {
	console.log('edit navigate artifactId',artifact);											

		navigation.navigate('edit', { params: { artifactId: artifact.id } })
	}

	function setup(result){

		setArtifact(result);
		console.log('setup ion show result', result);
		setGalleryImages(result.images);
		setLoadState('loaded');
	}
	useEffect(() => {
		console.log('useeffect in show::::::::');
		 if(isFocused){
		console.log('useeffect in show isFocused::::::::');
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
			<View style={styles.container}>
				{ 'loading' == loadState ? (
				null ) : (
					<ArtifactView route={route} artifact={artifact} navigation={navigation} galleryImages={galleryImages} setGalleryImages={setGalleryImages}></ArtifactView>
					) }			

 			</View>
    );
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent:'center',
		alignItems:'center',
		padding: 16

	},
	header:{
		position:'absolute',
		textAlign:'left',
		top:Constants.statusBarHeight + 5,
		left:0,
		right:0,
		backgroundColor:'white'
	},
	headerText:{
		textAlign:'left',
		fontSize:26,
		marginLeft:16,
		lineHeight:72,
		fontWeight:'600'
	},	
	title: {
		fontSize: 24,
		fontWeight: 'bold',
		marginBottom: 16,
	},
	item: {
		backgroundColor: '#f5f5f5',
		padding: 10,
		marginVertical: 8,
		borderRadius: 8,
	},
});
export default ShowArtifact;