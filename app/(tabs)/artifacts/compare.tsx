import  ArtifactView  from '@/components/ArtifactView';

import { FlatList, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import Slider from '@react-native-community/slider';
import { useState, useEffect } from 'react';
import  {ArtifactsService}  from '@/utilities/ArtifactsService';
import  {EloService}  from '@/utilities/EloService';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';
import { useIsFocused } from '@react-navigation/native'
import Constants from 'expo-constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Asset, useAssets } from 'expo-asset';
import _ from "lodash";
import CustomButton from '@/components/Button';

function CompareArtifact({ route, navigation, artifacts, artifactId, artifactsCompareList }) {
	const [loadState, setLoadState] = useState(null);	
	const [artifact, setArtifact] = useState(null);	
	const [comparableOne, setComparableOne] = useState([]);	
	const [comparableTwo, setComparableTwo] = useState([]);	
	const [comparisonValue, setComparisonValue] = useState(4);	
	const [newArtifactsCompare, setNewArtifactsCompare] = useState([]);
	const [primaryImage, setPrimaryImage] = useState(null);	
	const isFocused = useIsFocused()
	const local = useLocalSearchParams();
//console.log('artifactsCompareList!!!!!!!::::::::::::::',artifactsCompareList);
//console.log('data artifacts!!!!!!!::::::::::::::',artifacts);
	const imageBaseUrl = "https://zkd.b51.mytemp.website/images/";
	const [assets, error] = useAssets( [require('../../../assets/images/loading.gif'), require('../../../assets/images/saving.gif')]);
	const loadingIcon = ( assets?.length  ? assets[0] : null );
	function setup(result){
		//setArtifact(result);
		//alert(2);
		Object.keys( result.images ).forEach( (k, i) => {
			if( result.primary_image_id == result.images[k].id ){
				setPrimaryImage(result.images[k] );
				//console.log('result images::::', result.images[k].id);
			}
		})
		if( !primaryImage ){
			setPrimaryImage(result.images[0] );			
		}

//console.log('newArtifactsCompare', newArtifactsCompare);
//		var newComparables = pickTwo( artifactsCompareList ) 
//		if( )
//		setPrimaryImage(result.images);
		setLoadState('loaded');
	}
	const submitComparison = compVal => {
		setComparisonValue( compVal );
		onSubmit();
	}
	const onSubmit = data => {
		var form = new FormData();
		var secondary_artifact_id = 612;
		var rating_signatory = 0;
		var rating_demos = 0;
		var category = null;
//        form.append('artifact_id', artifactId);
        form.append('primary_artifact_id', artifactId);
        form.append('secondary_artifact_one_id', comparableOne?.id );
//       form.append('rating_signatory_one', rating_signatory);
 //       form.append('rating_demos_one', rating_demos);
        form.append('secondary_artifact_two_id', comparableTwo?.id);
        form.append('comparison', comparisonValue );
 //       form.append('rating_signatory_two', rating_signatory);
   //     form.append('rating_demos_two', rating_demos);

        form.append('category', category);
        
		EloService({
                method:'createCompare',
                data:form
            })
            .then( result => {
                console.log('image save result',result);
			//	setSaveState(null);


            }).catch((error) => {
                console.log('saving error:',error);
			//	setSaveState(null);
            }) 
	}	
	var pluckTwo = function (obj) {
		const cloneObj = _.cloneDeep(obj);
				delete cloneObj[ artifactId ];

		const returnObj = [];
	    var keys = Object.keys(cloneObj);
	    var index1 = keys.length * Math.random() << 0;
	    var obj1 = cloneObj[ keys[ index1 ] ];
	    if( obj1.primary_image_id ){
	    	Object.keys( obj1.images ).forEach((k, i) => {
	    		if( obj1.images[k].id == obj1.primary_image_id ){
	    			var image1 = obj1.images[k];
	    		}
	    	})
	    }
	    else{
	    	var image1 = obj1.images[0];	    	
	    }
		image1.artifactId = obj1.id;
    	returnObj.push( image1 );
    	delete cloneObj[ keys[ index1 ] ];

	    var newKeys = Object.keys(cloneObj);
	    var index2 = newKeys.length * Math.random() << 0;
	    var obj2 = cloneObj[ newKeys[ index2 ] ];
	    if( obj2 ){
	    	if( obj2.primary_image_id ){
		    	Object.keys( obj2.images ).forEach((k, i) => {
		    		if( obj2.images[k].id == obj2.primary_image_id ){
		    			var image2 = obj2.images[k];
		    		}
		    	})
		    }
		    else{
		    	var image2 = obj2.images[0];	    	
		    }
			image2.artifactId = obj2.id;
	    	returnObj.push( image2 );
		}
		return returnObj;
	};
	useEffect(() => {
			if( artifactId ){
				const newArtifactsCompareList = _.cloneDeep( artifactsCompareList );
				var comparables = pluckTwo( newArtifactsCompareList );
				setComparableOne( comparables[0] );
				setComparableTwo( comparables[1] );
		        ArtifactsService({
		        	method:'getById',
		        	id:artifactId
		        })
		        .then( (results) => {
		        	console.log('COMPARE get results', results);
		        	if( Array.isArray( results ) ){
		        		setup(results[0]);
		        	}
		        	else{
			        	setup(results);
			        }
		        })
				.catch((error) => {
                	console.log('line 49:::::::::::error', error);
            	});
			}
		 if(isFocused){
			//setLoadState('loading');
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
				<>
					<View style={viewStyles.container}>
						<Text>Compare ({artifactId}) : {primaryImage?.id}</Text>
						<Image source={{uri:imageBaseUrl + (primaryImage?.name ? primaryImage.name : null)}} /* Use item to set the image source */
							style={{
								width:'100%',
								height:'auto',
								aspectRatio:1,
								backgroundColor:'#d0d0d0',
								margin:6
							}}
						/>
		 			</View>
					<View style={{flex:1, flexDirection:'row'}}>
						<View style={[viewStyles.half,{padding:10, paddingRight:5}]}>
							<Text>({comparableOne?.artifactId}): {comparableOne?.id}</Text>
							<Image source={{uri:imageBaseUrl + (comparableOne?.name ? comparableOne?.name : null)}} /* Use item to set the image source */
								style={viewStyles.image}
							/>				
						</View>
						<View style={[viewStyles.half,{padding:10, paddingLeft:5}]}>
							<Text>({comparableTwo?.artifactId}): {comparableTwo?.id}</Text>
<Pressable 
												style={({pressed}) => [

												]}
													onPress={ () => { submitComparison(7) }}
											>							
							<Image source={{uri:imageBaseUrl + (comparableTwo?.name ? comparableTwo?.name : null)}} /* Use item to set the image source */
								style={viewStyles.image}
							/>
							</Pressable>
						</View>	
					</View>
					<View style={{marginTop:-70}}>
						<Slider
						  style={{width: '100%', height: 40}}
						  minimumValue={1}
						  maximumValue={7}
						  step={1}
						  thumbTintColor="#000"
						  maximumTrackTintColor="#000"
						  minimumTrackTintColor="#000000"

			value={comparisonValue}
			onValueChange={value => setComparisonValue(value)}						  
						/>																						
					</View>
					<View style={{height:'auto'}}>
					<CustomButton
											styles={{
												borderRadius: 20,
												elevation: 3,
												color:'black',
												marginLeft: 'auto',
											}}						
											title={ "Save" }
											onPress={ () => { onSubmit() }}
										/>
					</View>
				</>
			) }
		</>
    );
}

const viewStyles = StyleSheet.create({
	container: {
		flex: 1,
		justifyContent:'center',
		alignItems:'center',
		padding: 16,

		marginTop:Constants.statusBarHeight

	},
	half:{
		justifyContent:'center',
		alignItems:'center',
		flex:1
	},
	image:{
		width:'100%',
		height:'auto',
		aspectRatio:1,
		backgroundColor:'#d0d0d0'
	}
});
export default CompareArtifact;