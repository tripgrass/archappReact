import  AddEdit  from '@/components/AddEdit';
import { View } from 'react-native';
import { useForm } from 'react-hook-form';
import {ArtifactsService}  from '@/utilities/ArtifactsService';
import { useState, useEffect } from 'react'



function Add({ route, navigation, data, tempId }) {
	console.log('add file data ', data);
	console.log('add file tempId ', tempId);
    return (
			<>
				<AddEdit navigation={navigation} initArtifactId={tempId} />
			</>
    );
}
export default Add;