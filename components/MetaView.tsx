import { Image,StyleSheet, View, Platform,Pressable, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useEffect, useState, useRef, useCallback} from 'react';
import {useImage} from "expo-image";
const s = require('@/components/style');
const imageBaseUrl = "https://zkd.b51.mytemp.website/images/";
import { WebView } from 'react-native-webview';
import Constants from 'expo-constants';

type Props = {
	label: string;
	styles?: () => void;
	theme?: 'primary';
	onPress?: () => void;
};

export default function MetaView({ artifactId, image, slideoutMetaState, setSlideoutMetaState, galleryImages, setImage, metaType, setMetaType, post, setPost, metaObject }) {
		var TextClass = s.pressableButtonText;
		if( image){
			var src = imageBaseUrl + image?.name;
			console.log('META VIEW src', src);
			var img = useImage(src, {
					maxWidth: 800,
					onError(error, retry) {
					console.error('Loading failed:', error.message);
					}
				}			
			);
		}
		const [ratio, setRatio] = useState(1);   
		var source = post?.content ? post?.content : "<p>empty</p>";
		var source = `<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
		<div style='height:100vh; width:100%;'>
		<h1 style="">` + metaObject.post_title + `</H1>` + source + `</div>`;
const tagsStyles = {
  body: {
  	fontSize:19,
  	lineHeight:23,
    whiteSpace: 'normal',
  },
  span:{
  },
  a: {
    color: 'green'
  },
  b: {
    color: 'green'
  }

};		 

		useEffect(() => {
console.log('hasssllllll IMAGE!', img);
	        setRatio( Math.min( img?.width / img?.height) );
		});
		return (
				<View 
					style={[ 
	                    ('out' == slideoutMetaState) ? (
	                        {
								backgroundColor:'',
								top:175,
								display:'flex',
								height:'100%'
	                        }
	                    ) : (
	                        {
	                            display:'none'
	                        }
	                    ) ]
				}>
						<View style={{flex:1, flexDirection:'column'}}>
							<View style={{display:'block'}}>
							

				{ ( 'image' == metaType && image && "undefined" != image) ?
					(
						<>
								<Image source={{uri:imageBaseUrl + image?.name}} /* Use item to set the image source */
									contentFit="fit"
									style={{
										width: (ratio <= 1) ? null : '100%',
									//	height: (ratio <= 1) ? '100%' : null,
										aspectRatio: ratio,
										backgroundColor:'#d0d0d0',
										//resizeMode:'contain',
									}}

								/>
							</>
						) : 
						(<></>)
				}
				{ ( 'post' == metaType ) ?
					(
						<View
							style={{padding:10, height:'100%' , backgroundColor:'white'}}
						>
    <WebView
		style={{
			flex: 1,
		
		}}	
        originWhitelist={['*']}
        source={{ html: source }}
      />
						</View>
					) : 
					(<></>)
				}				

							</View>
						</View>
			</View>
	 	);
} 