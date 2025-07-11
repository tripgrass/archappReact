import  AddEditCollection  from '@/components/AddEditCollection';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';
import { useSession } from '@/utilities/AuthContext';
import { useState, useEffect } from 'react';



function EditCollection({ route, navigation, initialParams, params, collectionId, setCollectionId }) {

	console.log('in collection edit data initialParams:', initialParams);
	console.log('in collection edit data collectionId:', collectionId);
	console.log('in collection edit data params:', params);

	console.log('in (tabs)/collection edit route', route);
		const local = useLocalSearchParams();
//		const artifactId  = ( Platform.OS == "web" ) ? ( local.artifactId ? local.artifactId : null ) : (route?.params?.params ? route?.params?.params?.artifactId : null);
//		const [artifact, setArtifact] = useState(artifact);	
//		const [artifacts, setArtifacts] = useState([]);	
		const { userSession } = useSession();
//		console.log('USER SESSION', userSession);
//	const collectionId  = ( Platform.OS == "web" ) ? ( local.collectionId ? local.collectionId : null ) : (route?.params?.params ? route?.params?.params?.collectionId : null);
//console.log('edit.tsx collectionID ', collectionId);

					

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
				{collectionId ? <AddEditCollection initCollectionId={collectionId} artifacts={initialParams.artifacts} artifactsList={initialParams.artifactsList}/> : <></> }
 			</>
    );
}

export default EditCollection;