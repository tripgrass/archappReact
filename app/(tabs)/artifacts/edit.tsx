import  AddEdit  from '@/components/AddEdit';
import  {ArtifactsService}  from '@/utilities/ArtifactsService';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';
import { useSession } from '@/utilities/AuthContext';
import { useState, useEffect } from 'react';



function EditArtifact({ route, navigation }) {
	console.log('in edit route:', route);
		const local = useLocalSearchParams();
//		const artifactId  = ( Platform.OS == "web" ) ? ( local.artifactId ? local.artifactId : null ) : (route?.params?.params ? route?.params?.params?.artifactId : null);
//		const [artifact, setArtifact] = useState(artifact);	
//		const [artifacts, setArtifacts] = useState([]);	
		const { userSession } = useSession();
//		console.log('USER SESSION', userSession);
	const artifactId  = ( Platform.OS == "web" ) ? ( local.artifactId ? local.artifactId : null ) : (route?.params?.params ? route?.params?.params?.artifactId : null);
console.log('edit.tsx artifactID ', artifactId);

					

/*
		useEffect(() => {
			if( artifactId ){
				console.log('USER SESSION', userSession);
				{ (userSession) ? (
		            ArtifactsService({
		            		method:'getById',
		            		id:artifactId
		            })
		            .then( (results) => {
		            	console.log('useeffects to edit artifact ', results);
		                setArtifact(results)
		            })
		            .catch(console.log('.error'))
				) : null }
			}
		}, []);    
*/
    return (
			<>
				{artifactId ? <AddEdit initArtifactId={artifactId} navigation={navigation}/> : <></> }
 			</>
    );
}

export default EditArtifact;