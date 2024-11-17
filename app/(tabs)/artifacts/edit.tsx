import  AddEdit  from '@/components/AddEdit';
import  {ArtifactsService}  from '@/utilities/ArtifactsService';
import { FlatList, Platform, StyleSheet, Text, View } from 'react-native';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';
import { useSession } from '@/utilities/AuthContext';
import { useState, useEffect } from 'react';

function EditArtifact({ route, navigation }) {
		const local = useLocalSearchParams();
		const artifactId  = ( Platform.OS == "web" ) ? ( local.artifactId ? local.artifactId : null ) : (route?.params?.params ? route?.params?.params?.artifactId : null);
		const [artifact, setArtifact] = useState(null);	
		const [artifacts, setArtifacts] = useState([]);	
		const { userSession } = useSession();

		useEffect(() => {
				if( artifactId ){
					{ (userSession) ? (
            ArtifactsService({
            		method:'getById',
            		id:artifactId
            })
            .then( (results) => {
                setArtifact(results)
            })
            .catch(console.log('.error'))
          ) : null }
	      }
    }, []);    

    return (
			<>
				{artifact ? <AddEdit artifact={artifact} navigation={navigation}/> : <></> }
 			</>
    );
}

export default EditArtifact;