import  AddEdit  from '@/components/AddEdit';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import  {ArtifactsService}  from '@/utilities/ArtifactsService';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';
import { useIsFocused } from '@react-navigation/native'

function ShowArtifact({ route, navigation }) {
	 const isFocused = useIsFocused()
	const local = useLocalSearchParams();
	const artifactId  = ( Platform.OS == "web" ) ? ( local.artifactId ? local.artifactId : null ) : (route?.params?.params ? route?.params?.params?.artifactId : null);

	const [artifact, setArtifact] = useState(null);	
	const [artifacts, setArtifacts] = useState([]);
	function setup(result){
		setArtifact(result);
	}
	useEffect(() => {
		 if(isFocused){
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
				<View style={styles.header}>
					<Text style={styles.headerText}>{artifact?.name}</Text>
				</View>
				<Text>{artifact?.address}</Text>
				<Text>{artifact?.city}, {artifact?.state}</Text>
 			</View>
    );
}

const styles = StyleSheet.create({
	container: {
		paddingTop:70,
		flex: 1,
		justifyContent:'center',
		alignItems:'center',
		padding: 16

	},
	header:{
		position:'absolute',
		textAlign:'left',
		top:0,
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