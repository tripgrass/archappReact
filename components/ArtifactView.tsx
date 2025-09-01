import { FlatList, Image, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import  {ArtifactsService}  from '@/utilities/ArtifactsService';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';
import { useIsFocused } from '@react-navigation/native'
import Constants from 'expo-constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import PostView from '@/components/PostView';
import  ImageView  from '@/components/ImageView';
import CustomButton from '@/components/Button';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';

function ArtifactView({ artifact, route, navigation, galleryImages, setGalleryImages, setLoadState }) {
	const isFocused = useIsFocused()
	const local = useLocalSearchParams();
	const artifactId  = ( Platform.OS == "web" ) ? ( local.artifactId ? local.artifactId : null ) : (route?.params?.params ? route?.params?.params?.artifactId : null);
	const [imageId, setImageId] = useState(null);
	const [image, setImage] = useState(null);
	const [slideoutImageState, setslideoutImageState] = useState('in');
	const [artifacts, setArtifacts] = useState([]);
	const imageBaseUrl = "https://zkd.b51.mytemp.website/images/";
	const [slideoutState, setslideoutState] = useState('in');
	const [postState, setPostState] = useState(null);

//console.log(galleryImages.length);
	var isOdd = 0;
	if( galleryImages.length % 2 ){
//		console.log('is odd');
		var isOdd = 1;
	}
	else{
//		console.log('is even');

	}

	const navigateToEdit = () => {

		setLoadState('loading');
		navigation.navigate('edit', { params: { artifactId: artifact.id } })
	}

	const openLightbox = imageItem => {
		setslideoutImageState( 'out' );
		setImage( imageItem );
		console.log('openLightbox !!!!!!!!!!!!!!!!!! global image', image);

		console.log('openLightbox !!!!!!!!!!!!!!!!!! imageItem', imageItem);
	}

	const navigateToPost = post => {
setslideoutState( 'out' );
		console.log('post', post);
		setPostState( post );
//		setLoadState('loading');
//		navigation.navigate('edit', { params: { artifactId: artifact.id } })
	}	
    return (
    	<>

			<View style={{backgroundColor:'', width:'100%'}}>
				<View style={viewStyles.header}>

                        <TouchableOpacity
                            style={{
                                height: 50,
                                left:7,
                                position:'absolute',
                                width: 50,
                                top:7,
                                zIndex:9,
                                backgroundColor:'white'
                            }}
                        >
                            <Ionicons name="chevron-back" size={50} color="black" style={{
                                display:'flex-inline',
                                height:50,
                                width:50,
                            }}/>
                        </TouchableOpacity>                                                                      
					<Text style={viewStyles.headerTitle}>{artifact?.name}</Text>
					<Text style={viewStyles.headerText}>{artifact?.address}</Text>
					<Text style={viewStyles.headerText}>{artifact?.city}, {artifact?.state}</Text>
				</View>				
				{image && 
				<ImageView
					artifactId={artifactId}
					imageId={imageId}	
					image={image}	
					slideoutImageState={slideoutImageState} 
					setslideoutImageState={setslideoutImageState}									
					styles={{
						display:'none',
						borderRadius: 20,
						elevation: 3,
						color:'black',
						backgroundColor:'blue',
						marginLeft: 'auto',
					}}						
					title={ "Save" }
					onPress={ () => { onSubmit() }}
				/>}				
				
				<ScrollView style={{backgroundColor:'',  zIndex: -1,  elevation: -1}}>				
				
					<PostView  artifactId={artifactId}  slideoutState={slideoutState} setslideoutState={setslideoutState} postState={postState} setPostState={setPostState}></PostView>

					<View style={{minHeight:vh(90),  paddingTop:120, backgroundColor:'', width:'100%'}}>
							
							{galleryImages && galleryImages.length > 0 ? (
								<FlatList
									columnWrapperStyle={{ }}									
									contentContainerStyle={{ flex:1, justifyContent:'flex-start', alignItems:'flex-start', padding:5}}
									data={galleryImages}
									numColumns={2}
									extraData={galleryImages}
									keyExtractor={(item, index) => {return  index.toString();}}
									renderItem={ ({ item, index }) => (
										<View key={item.id} serverId={item.id} style={{
											width: (isOdd && index == ( galleryImages.length - 1 )) ?  vw(50) : '50%',
											//backgroundColor: ( index % 2 ) ? '#d0d0d0' : null,
											padding:5,
											textAlign:'center'
										}}>
											<Pressable
												onPress={() => {
													console.log('click'); 
													openLightbox(item);
												}}
												style={{}}												
  											>
  												{item.name &&
												<Image source={{uri:imageBaseUrl + item.name}} /* Use item to set the image source */
													style={{
														backgroundColor:'red',
														width:'100%',
														height: undefined,
//														height:150,
														aspectRatio:1,
														resizeMode:'fill',
														borderRadius:10,
														overflow: "hidden",
													}}

												/>}
											</Pressable>
										</View>
									)}
								/>
							) : (
								<></>
							)}
							{artifact.posts && artifact.posts.length > 0 ? (
								<FlatList
									style={{width:'100%'}}
									contentContainerStyle={{  flex:1, alignItems:'stretch', marginBottom:60}}
									horizontal={false} 
									showsHorizontalScrollIndicator={true} 
									data={artifact.posts}
									extraData={artifact.posts}
									keyExtractor={(item, index) => {return  index.toString();}}
									renderItem={ ({ item, index }) => (
									<View key={item.id} serverId={item.id} style={{width:'100%'}}>
										<Pressable artifact={artifact}
											style={({pressed}) => [{
												backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
												alignItems: 'center',
												justifyContent: 'center',
												//elevation: 8,
												padding:20,
											}]}
											onPress={ () => { navigateToPost( item ) }}
										>
											<Text style={{display:'block'}}>{item?.post_title}</Text>
										</Pressable>
									</View>
									)}
								/>
							) : (
								<></>
							)}																		
							
						</View>	
				</ScrollView>
				<View
					style={{
						position:'absolute',
						bottom:20,
						left:14,
					}}
				>
						<Pressable artifact={artifact}
							style={({pressed}) => [
											{
									backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
									alignItems: 'center',
									justifyContent: 'center',
									borderRadius: 40,
									borderColor:'rgb(230,230,230)',
									borderWidth:2,
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
			</View >
		</>
    );
}

const viewStyles = StyleSheet.create({
	
	header:{
		width:'100%',
		position:'absolute',
		textAlign:'center',
		borderTopWidth:Constants.statusBarHeight + 5,
		borderTopColor:'white',
		left:0,
		right:0,
		paddingBottom:14,
		backgroundColor:'white'
	},
	headerTitle:{
		textAlign:'center',
		fontSize:26,
		lineHeight:60,
		fontWeight:'600'
	},
	headerText:{
		textAlign:'center',
		fontSize:14,
		lineHeight:20,
		fontWeight:'400'
	}	
});
export default ArtifactView;