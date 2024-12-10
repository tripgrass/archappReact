import  AddEdit  from '@/components/AddEdit';
import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import {ArtifactsService}  from '@/utilities/ArtifactsService';
import { useState, useEffect } from 'react'



function Add({ route, navigation }) {
	const [lazyArtifactId, setLazyArtifactId] = useState(null);	

	function createArtifactId(){
		var form = new FormData();
		form.append('idOnly', true);

		ArtifactsService({
	        	method:'create',
	        	url:'artifacts',
	        	data:form
	        }).then( (results) => {
	        	console.log('after submit results', results);
	        	var newArtifact = results;
	        	console.log('newartifact ',newArtifact);
	  //      	setArtifact(newArtifact);
	        	setLazyArtifactId(newArtifact.id);


		}).catch((error) => {
			console.log('saving error:',error);
	    })				
	}
	useEffect(() => {
		if( !lazyArtifactId ){
			createArtifactId();
		}
	});
    return (
			<>
				<AddEdit navigation={navigation} initArtifactId={lazyArtifactId} />
			</>
    );
}
export default Add;