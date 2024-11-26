import  AddEdit  from '@/components/AddEdit';
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

	console.log('show artifact===============', artifact);
	const [artifacts, setArtifacts] = useState([]);
	const [galleryImages, setGalleryImages] = useState([]);
	const imageBaseUrl = "https://zkd.b51.mytemp.website/images/";

	function setup(result){
		setArtifact(result);
		console.log('setup ion show result', result);
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
		        }).then(result => setup(result))
		            .catch(console.log('in show.tsx .error'))
				}
			}
    }, [isFocused]);    

    return (
			<View style={styles.container}>
				{ 'loading' == loadState ? (
				null ) : (
					<>
				<View style={styles.header}>
					<Text style={styles.headerText}>{artifact?.name}</Text>

				</View>
					<View style={{display:'flex',flex:1, justifyContent:'center', alignItems:'center', marginTop:150}}>
							<>
								<Text>{artifact?.address}</Text>
								<Text>{artifact?.city}, {artifact?.state}</Text>
							</>
							{galleryImages && galleryImages.length > 0 ? (
								<FlatList
									contentContainerStyle={{ flex:1, justifyContent:'center', alignItems:'center'}}
									horizontal={true} 
									showsHorizontalScrollIndicator={true} 
									data={galleryImages}
									extraData={galleryImages}
									keyExtractor={(item, index) => {return  index.toString();}}
									renderItem={ ({ item, index }) => (
										<View key={item.id} serverId={item.id} style={{}}>
										<Image source={{uri:imageBaseUrl + item.name}} /* Use item to set the image source */
											style={{
												width:150,
												height:150,
												backgroundColor:'#d0d0d0',
												//resizeMode:'contain',
												margin:6
											}}
										/>
										</View>
									)}
								/>
							) : (
								<></>
							)}

						</View>	
					</>
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