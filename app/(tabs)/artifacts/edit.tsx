import  AddEdit  from '@/components/AddEdit';
import  {ArtifactsService}  from '@/utilities/ArtifactsService';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';
import { useSession } from '@/utilities/AuthContext';
import { useState, useEffect } from 'react';



function EditArtifact({ route, navigation, data, artifactId, collectionId, setCollectionId, }) {
	console.log('in edit route data:', data);
	console.log('in edit route:', route);
	console.log('in edit nav:', navigation);
		const local = useLocalSearchParams();
//		const artifactId  = ( Platform.OS == "web" ) ? ( local.artifactId ? local.artifactId : null ) : (route?.params?.params ? route?.params?.params?.artifactId : null);
//		const [artifact, setArtifact] = useState(artifact);	
//		const [artifacts, setArtifacts] = useState([]);	
		const { userSession } = useSession();
//		console.log('USER SESSION', userSession);
//	const artifactId  = ( Platform.OS == "web" ) ? ( local.artifactId ? local.artifactId : null ) : (route?.params?.params ? route?.params?.params?.artifactId : null);
console.log('edit.tsx artifactID ', artifactId);

					

    return (
			<>
				{artifactId ? <AddEdit initArtifactId={artifactId} navigation={navigation} collectionId={collectionId} setCollectionId={setCollectionId}/> : <></> }
 			</>
    );
}

export default EditArtifact;