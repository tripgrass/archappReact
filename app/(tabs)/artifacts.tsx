import React, { useState, useEffect, useRef } from 'react';
import { Pressable, View, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import CustomButton from '@/components/Button';

import { useNavigation, Link } from 'expo-router';
import  {ArtifactsService}  from '@/utilities/ArtifactsService';
const s = require('@/components/style');
import { usePathname, useRouter, useSegments } from 'expo-router';

const App = ({navigation}) => {

	const router = useRouter();

    const pathname = usePathname();
    console.log(pathname);
	
   const [artifacts, setArtifacts] = useState([]); 
   useEffect(() => {
        { (userSession) ? (

            ArtifactsService({method:'getAll'})
                .then( (results) => {
                    setArtifacts(results)
                })
                .catch((error) => console.log('in profile getall .error', error))
            ) : null }
   }, []);


	return (
	

			<FlatList
				style={styles.container,{padding:20, marginBottom:30}}
				data={artifacts}
				keyExtractor={(item) => String(item.id)}
				renderItem={({ item, index }) => 
					<View key={index} style={{ maxWidth:'1200px', margin:'0 auto', display:'flex', flexWrap:'wrap',flexDirection:'row',width:'100%', alignItems:'center', marginTop:8}}>
						<Text style={{width:'30%',flexGrow: 1}}>{item.name}</Text>

						<CustomButton
							title="Edit"
							webbable={true}
							url={'/edit/' + item.id }						
							styles={{marginRight:10}}
							onPress={() => { navigation.navigate('edit', {
									      params: { artifactId: item.id }
									   }) 
									}}
						/>
						<CustomButton
							webbable={true}
							url={'/show/' + item.id }						
							title="View"
							onPress={() => { navigation.navigate('show', {
									      params: { artifactId: item.id }
									   }) 
									}}
						/>						

					</View>
				}				
			/>

	);
};

const styles = StyleSheet.create({
	container: {
		paddingTop:70,
		paddingBottom:100,
		flex: 1,
		justifyContent:'center',
		alignItems:'center',
		padding: 16
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

export default App;