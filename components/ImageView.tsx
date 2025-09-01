import { Image,StyleSheet, View, Platform,Pressable, Text, TouchableOpacity } from 'react-native';
import { Link } from 'expo-router';
import { useEffect, useState, useRef, useCallback} from 'react';
import {useImage} from "expo-image";
const s = require('@/components/style');
const imageBaseUrl = "https://zkd.b51.mytemp.website/images/";

type Props = {
	label: string;
	styles?: () => void;
	theme?: 'primary';
	onPress?: () => void;
};

export default function ImageView({ artifactId, image, slideoutImageState, setslideoutImageState }) {
		var TextClass = s.pressableButtonText;
		var src = imageBaseUrl + image?.name;
		var img = useImage(src);
		const [ratio, setRatio] = useState(1);    

		useEffect(() => {
console.log('hasssllllll IMAGE!', img);
	        setRatio( Math.min( img?.width / img?.height) );
	        console.log('ratio', ratio);
		});
console.log(image?.url);
		return (
				<View 
					style={[ 
	                    ('out' == slideoutImageState) ? (
	                        {
								backgroundColor:'',
								top:160,
								display:'flex',
								height:'100%'
	                        }
	                    ) : (
	                        {
	                            display:'none'
	                        }
	                    ) ]

				}>
				{ ( image && "undefined" != image) ?
					(
						<View style={{flex:1}}>
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
							<View style={{flex:1}}>
								<TouchableOpacity
		                            style={{
		                                height: 50,
		                                left:7,
		                                width: 50,
		                                top:7,
		                                zIndex:9,
		                                backgroundColor:'red'
		                            }}
		                        >
		                            <Text>Previous</Text>
		                        </TouchableOpacity>  						
								<TouchableOpacity
		                            style={{
		                                height: 50,
		                                right:7,
		                                width: 50,
		                                top:7,
		                                zIndex:9,
		                                backgroundColor:'red'
		                            }}
		                        >
		                            <Text>Next</Text>
		                        </TouchableOpacity>  						
								<Text >{artifactId}+{(image?.id) ? image.id : null}</Text>
							</View>
						</View>
						) : 
						(<></>)
				}
			</View>
	 	);
} 