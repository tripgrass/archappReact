import  AddEdit  from '@/components/AddEdit';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { useState, useEffect } from 'react';
import  {ArtifactsService}  from '@/utilities/ArtifactsService';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';

function EditArtifact({ route, navigation }) {
		const local = useLocalSearchParams();
		const artifactId  = ( Platform.OS == "web" ) ? ( local.artifactId ? local.artifactId : null ) : (route?.params?.params ? route?.params?.params?.artifactId : null);

		const [artifact, setArtifact] = useState(null);	
		const [artifacts, setArtifacts] = useState([]);	
		useEffect(() => {
				if( artifactId ){
	        ArtifactsService.getById(artifactId)
	            .then(result => setArtifact(result))
	            .catch(console.log('.error'))
	      }
    }, []);    

    return (
			<>
				{artifact ? <AddEdit artifact={artifact} navigation={navigation}/> : <></> }
 			</>
    );
}

export default EditArtifact;