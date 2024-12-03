import { FlatList, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import  {ArtifactsService}  from '@/utilities/ArtifactsService';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';
import { useIsFocused } from '@react-navigation/native'
import Constants from 'expo-constants';
import Ionicons from '@expo/vector-icons/Ionicons';

function ArtifactView({ artifact, route, navigation, galleryImages, setGalleryImages, setLoadState }) {
	const isFocused = useIsFocused()
	const local = useLocalSearchParams();
	const artifactId  = ( Platform.OS == "web" ) ? ( local.artifactId ? local.artifactId : null ) : (route?.params?.params ? route?.params?.params?.artifactId : null);

	const [artifacts, setArtifacts] = useState([]);
	const imageBaseUrl = "https://zkd.b51.mytemp.website/images/";

	const navigateToEdit = () => {

		setLoadState('loading');
		navigation.navigate('edit', { params: { artifactId: artifact.id } })
	}
    return (
			<>
				<View style={viewStyles.header}>
					<Text style={viewStyles.headerText}>{artifact?.name}</Text>

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
							<View
								style={{
									position:'absolute',
									bottom:10,
									left:0,
								}}
							>
									<Pressable artifact={artifact}
										style={({pressed}) => [
														{
												backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
												alignItems: 'center',
												justifyContent: 'center',
												borderRadius: 40,
												height:80,
												width:80,
												elevation: 8,
												marginLeft: 5,					    		
												boxShadow: '0px 2px 2px #d8d8d8'						        
														}
										]}
										onPress={ () => { navigateToEdit() }}
									>
										<Text>Edit</Text>
									</Pressable> 
							</View>
						</View>	
					</>
    );
}

const viewStyles = StyleSheet.create({
	
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
	}
});
export default ArtifactView;