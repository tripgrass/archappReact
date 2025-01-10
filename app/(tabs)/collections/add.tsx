import  AddEditCollection  from '@/components/AddEditCollection';
import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import {ArtifactsService}  from '@/utilities/ArtifactsService';
import { useState, useEffect } from 'react'



function Add({ route, navigation, data, tempId, artifacts }) {
	console.log('add file data ', data);
	console.log('add file tempId ', tempId);
    return (
			<>
				<AddEditCollection navigation={navigation} initArtifactId={tempId} artifacts={artifacts}/>
			</>
    );
}
export default Add;