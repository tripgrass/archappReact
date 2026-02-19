import { Dimensions, FlatList, Image, Platform, Pressable, StyleSheet, Text, TouchableOpacity, View, ScrollView } from 'react-native';
import { useState, useEffect } from 'react';
import  {ArtifactsService}  from '@/utilities/ArtifactsService';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';
import { useIsFocused } from '@react-navigation/native'
import Constants from 'expo-constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import PostView from '@/components/PostView';
import  MetaView  from '@/components/MetaView';
import CustomButton from '@/components/Button';
import { vw, vh, vmin, vmax } from 'react-native-expo-viewport-units';
import { useSession } from '@/utilities/AuthContext';
import * as Linking from 'expo-linking';

function ArtifactView({ artifact, route, navigation, galleryImages, setGalleryImages, setLoadState }) {
	const { userSession, signOut } = useSession();	
	const isFocused = useIsFocused()
	const local = useLocalSearchParams();
	const artifactId  = ( Platform.OS == "web" ) ? ( local.artifactId ? local.artifactId : null ) : (route?.params?.params ? route?.params?.params?.artifactId : null);
	const [imageId, setImageId] = useState(null);
	const [image, setImage] = useState(null);
	const [list, setList] = useState(null);
	const [ metaObject, setMetaObject] = useState(null);
	const [metaType, setMetaType] = useState(null);
	const [slideoutMetaState, setSlideoutMetaState] = useState('in');
	const [artifacts, setArtifacts] = useState([]);
	const imageBaseUrl = "https://zkd.b51.mytemp.website/images/";
	const [slideoutState, setslideoutState] = useState('in');
	const [postState, setPostState] = useState(null);
	const [post, setPost] = useState(null);


console.log('galleryImages', galleryImages);
//console.log('!!!!!!!!!!!!!!!!!',artifact.posts);
	var isOdd = 0;
	if( galleryImages.length % 2 ){
//		console.log('is odd');
		var isOdd = 1;
	}
	else{
//		console.log('is even');

	}
	const onMetaClose = (  ) => {
console.log('back from image' , artifact.id);
		setSlideoutMetaState( 'in' );
		setImage( null );
		setMetaType(null);
		navigation.navigate( 'show', { params: { artifactId: artifact.id } })
	}
	const onBack = (  ) => {
console.log('back to home?' , artifact.id);
		//setSlideoutMetaState( 'in' );
		//setImage( null );

//		navigation.navigate( 'show', { params: { artifactId: artifact.id } })
		navigation.navigate( 'Home');
	}

	const navigateToEdit = () => {

		setLoadState('loading');
		navigation.navigate('edit', { params: { artifactId: artifact.id } })
	}
	const isStart = (  ) => {
		var lastListObj = list[Object.keys(list)[0]];
		if( lastListObj ){
			var lastListID = (lastListObj.id ? lastListObj.id : lastListObj.ID);
			var metaObjectID = (metaObject.id ? metaObject.id : metaObject.ID);
			if( metaObjectID == lastListID ){
				return true;
			}
		}
	}	
	const isEnd = ( ) => {
		var lastListObj = list[Object.keys(list)[Object.keys(list).length - 1]];
		if( lastListObj ){
			var lastListID = (lastListObj.id ? lastListObj.id : lastListObj.ID);
			var metaObjectID = (metaObject.id ? metaObject.id : metaObject.ID);
			if( metaObjectID == lastListID ){
				return true;
			}
		}
	}
		const gotoPrev = (  ) => {
			if( 'image' == metaType ){
				var prevImage = navMeta( image.id, 'prev');
				setImage( prevImage );
				setMetaObject( prevImage );
			}
			if( 'post' == metaType ){
				console.log('gotoprev post', post);
				var prevPost = navMeta( post.id, 'prev');
				console.log('gotoprev prevPost', prevPost);
				//setPost( prevPost );
				setMetaObject( prevPost );
			}			
		}
		const gotoNext = (  ) => {
			if( 'image' == metaType ){
				var nextImage = navMeta( image.id, 'next' );
				setImage( nextImage );
				setMetaObject( nextImage );
			}
			if( 'post' == metaType ){
				var nextPost = navMeta( post.id, 'next');
				console.log('gotoprev nextPost', nextPost);
				//setPost( prevPost );
				setMetaObject( nextPost );
			}						
		}
 		const navMeta = ( obj_id, direction ) => {			
		    let lastKey = "";
		    let nextKey = "";
			if( 'image' == metaType ){
				var list = galleryImages;
			}
			if( 'post' == metaType ){
				var list = artifact.posts;
			}

	    	if( 'next' == direction ){
	    		var isCurrent = false;
			    for (const key in list) {
			        if (list.hasOwnProperty(key)) {
			            if ( !isCurrent && list[key].id == obj_id){
			            	isCurrent = true;
						console.log('NO SOLUTION' + obj_id + "--- ", list[key]);
						}
						else{
						console.log('solved' + obj_id + "--- ", list[key]);
				            if ( isCurrent ){
						console.log('is current:::::: ' , key);
				                return list[key];
							}
						}
					}
			    }
	    	}
	    	else{
	    		console.log('else');
			    for (const key in list) {
			        if (list.hasOwnProperty(key)) {
			            if ( list[key].id == obj_id){
			                lastKey = lastKey || key;
						console.log('is last! ', key);
			                return list[lastKey];
			            } else {
			                lastKey = key;
			            }
			        }
			    }
		    }
		}
	

	const openMetaImage = imageItem => {
		setSlideoutMetaState( 'out' );
		setImage( imageItem );
		setMetaType('image');
		setMetaObject( imageItem );
setList( galleryImages );
//		console.log('openMetaImage  global image', image);

//		console.log('openMetaImage imageItem', imageItem);
	}

	const openMetaPost = post => {
		console.log('post!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!', post);
		setSlideoutMetaState( 'out' );
		setImage( null );
		setMetaType('post');
		setMetaObject( post );
		setList( artifact.posts );
		setPost( post );
//		setLoadState('loading');
//		navigation.navigate('edit', { params: { artifactId: artifact.id } })
	}	
    return (
    	<>

			<View style={{backgroundColor:'', width:'100%'}}>
				{ (metaType ) &&  ( 'post' == metaType ) &&
<Pressable 
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
										position:'absolute',
										zIndex:9999,
										left:10,
										bottom: ( Dimensions.get("window").height - 70 ),
										elevation: 8,
										marginLeft: 5,					    		
										boxShadow: '0px 2px 2px #d8d8d8'						        
												}
								]}
								onPress={() => Linking.openURL('https://zkd.b51.mytemp.website/public/observations/wp-admin/post.php?post=' + post.ID + '&action=edit')}
							>
								<Text>Edit</Text>
							</Pressable> }											
				<View style={viewStyles.header}>
					{ (metaType && !isStart() ) && 					
						<TouchableOpacity
	                        style={{
	                        	position:'absolute',
	                        	bottom:10,
	                            paddingTop:10,
	                            paddingBottom:10,
	                            paddingRight:5,
	                            paddingLeft:20,
	                            zIndex:9,
	                        }}
							onPress={ () => { gotoPrev() }}		                            

	                    >
							<Ionicons name="chevron-back" size={30} color="black" style={{
	                            display:'flex-inline',
	                            height:30,
	                            width:30,
	                        }}/>		                            
	                    </TouchableOpacity>  	
	                }
					<Text style={viewStyles.headerTitle}>{artifact?.name}</Text>
					<Text style={viewStyles.headerText}>{artifact?.address}</Text>
					<Text style={viewStyles.headerText}>{artifact?.city}, {artifact?.state}</Text>
					{ (!metaType ) && 
						<TouchableOpacity
                            style={{
                                height: 30,
                                left:20,
                                position:'absolute',
                                width: 30,
                                top:7,
                                zIndex:9,
                                backgroundColor:'white'
                            }}
                            onPress={ () => { onBack() }}
                        >
                            <Ionicons name="chevron-back" size={30} color="red" style={{
                                display:'flex-inline',
                                height:30,
                                width:30,
                            }}/>
                        </TouchableOpacity>  
                    }
					{ (metaType  ) && 

                        <TouchableOpacity
                            style={{
                                height: 30,
                                right:20,
                                position:'absolute',
                                width: 30,
                                top:7,
                                zIndex:9,
                                backgroundColor:'white'
                            }}
                            onPress={ () => { onMetaClose() }}
                        >
                            <Ionicons name="close" size={30} color="" style={{
                                display:'flex-inline',
                                height:30,
                                width:30,
                            }}/>
                        </TouchableOpacity>   
                    }
					{ (metaType && !isEnd()) &&                        
					<TouchableOpacity
                        style={{

                        	position:'absolute',
                        	bottom:10,
							right:0,                        	
                            paddingTop:10,
                            paddingBottom:10,
                            paddingRight:20,
                            paddingLeft:5,
                            zIndex:9,
                            backgroundColor:''
                        }}
						onPress={ () => { gotoNext() }}		                            

                    >
						<Ionicons name="chevron-forward" size={30} color="black" style={{
                            display:'flex-inline',
                            height:30,
                            width:30,
                        }}/>		                            
                    </TouchableOpacity> 
                    } 	

				</View>				
				{ (metaType ) && 
				<MetaView
					artifactId={artifactId}
					imageId={ image ? imageId : null}	
					image={image ? image : null }
					metaType={metaType}
					setMetaType={setMetaType}
					galleryImages={galleryImages}
					setImage={setImage}	
					post={post}
					setPost={setPost}
					metaObject={metaObject}
					slideoutMetaState={slideoutMetaState} 
					setSlideoutMetaState={setSlideoutMetaState}									
					styles={{
						display:'none',
						borderRadius: 20,
						elevation: 3,
						color:'black',
						backgroundColor:'',
						marginLeft: 'auto',
					}}						
					title={ "Save" }
					onPress={ () => { onSubmit() }}
				/>}				
				
				<ScrollView style={{backgroundColor:'',  zIndex: -1,  elevation: -1}}>				
				

					<View style={{minHeight:vh(90),  paddingTop:180, backgroundColor:'', width:'100%'}}>
							
							{galleryImages && galleryImages.length > 0 ? (
								<FlatList
scrollEnabled={false}									
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
													openMetaImage(item);
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
							{ artifact.posts && artifact.posts.length > 0 ? (
								<FlatList
									scrollEnabled={false}									

									style={{width:'100%',marginTop:10}}
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
												alignItems: 'left',
												justifyContent: 'center',
												//elevation: 8,
												padding:20,
												borderBottomWidth:2,
												borderColor:'#e3e3e3'
											}]}
											onPress={ () => { openMetaPost( item ) }}
										>
											<Text style={{display:'block', fontWeight:700, fontSize:18}}>{item?.post_title}</Text>
											<Text style={{display:'block',fontSize:12, marginBottom:5, marginTop:-2}}>{item?.author?.first_name} {item?.author?.last_name}</Text>
											<Text style={{display:'block',fontSize:14}}>{item?.excerpt} </Text>
										</Pressable>
									</View>
									)}
								/>
							) : (
								<></>
							)}																		
							
						</View>	
				</ScrollView>
				{ userSession ? (
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
				) : (null)}
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
		paddingBottom:24,
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