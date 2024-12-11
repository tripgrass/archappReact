import React, { useState, useEffect, useRef} from 'react';
import { Pressable, View, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import CustomButton from '@/components/Button';
import { useSession } from '@/utilities/AuthContext';
import { useNavigation, Link } from 'expo-router';
import  {ArtifactsService}  from '@/utilities/ArtifactsService';
const s = require('@/components/style');
import { usePathname, useRouter, useSegments } from 'expo-router';

export default function ProfileScreen({  artifacts, setArtifacts }) {
    const router = useRouter();
    const { userSession, signOut, signIn } = useSession();
    const pathname = usePathname();
    const navigation = useNavigation();
    console.log('artifacts !!!!!!!!!!!!! in profile tab', navigation);
   
   useEffect(() => {
    console.log('useffect in profile tab');
        { (userSession) ? (

            ArtifactsService({method:'getAll'})
                .then( (results) => {

                console.log('RESULTS OF getall',  results)
                    setArtifacts(results)
                })
                .catch((error) => console.log('in profile getall .error', error))
            ) : null }
   }, []);
    const deleteArtifact = async ( id ) => { 
        ArtifactsService({method:'delete',id:id})
            .then( (results) => {
                if( results.data ){
                    console.log('RESULTS of delete',  results.data);
                    if( results.data.deleteResult ){
                        const newArtifacts = artifacts.filter(item => item.id !== id);
                        setArtifacts(newArtifacts);                        
                    }
                }
            })
            .catch((error) => console.log('in profile getall .error', error))        
    };

   return (
         <View style={{ alignItems: 'center', justifyContent: 'center', paddingTop:40, paddingBottom:10, backgroundColor:'' }}>
            <Text style={{fontSize:16,fontWeight:'700'}}>Profile Screen</Text>
            { (userSession) ? (
                <>
                    <FlatList
                        style={{paddingRight:20, marginBottom:0, paddinBottom:0, paddingLeft:20}}
                        data={artifacts}
                        keyExtractor={(item) => String(item.id)}
                        renderItem={({ item, index }) => 
                            <View key={index} style={{ backgroundColor:'', maxWidth:'1200px', margin:'0 auto', display:'flex', flexWrap:'wrap',flexDirection:'row',width:'100%', alignItems:'center', marginTop:8}}>
                                <Text style={{width:'30%',flexGrow: 1}}>{item.name}</Text>

                                <CustomButton
                                    title="Edit"
                                    webbable={true}
                                    url={'/edit/' + item.id }                 
                                    styles={{marginRight:5, paddingHorizontal: 14 }}
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
                                    styles={{marginRight:5, paddingHorizontal: 14 }}                                
                                />
                                <CustomButton
                                    webbable={true}
                                    styles={{marginRight:5, paddingHorizontal: 14 }}
                                    title="Archive"
                                    onPress={ () => { deleteArtifact( item.id ) }}

                                />                            
                            </View>
                        }           
                     /> 
                    <View style={{ backgroundColor:'', maxWidth:'1200px', margin:'0 auto', padding:44, display:'flex', flexWrap:'wrap',flexDirection:'row',width:'100%', alignItems:'center'}}>
                                <Text style={{width:'30%',flexGrow: 1}}></Text>

                                <CustomButton
                                    webbable={true}
                                    title="New Artifact+"
                                    onPress={() => { navigation.navigate('Add', {
                                        }) 
                                    }}
                                />                            
                            </View> 
                 </>
                 ) :
                <>
                 <CustomButton title="Sign In" 
                    style={{margin:20}}
                onPress={() => navigation.navigate('SignIn')} /> 
                 <CustomButton title="Register" 
                    style={{margin:20}}
                onPress={() => navigation.navigate('Register')} />                 
                <Text>
                   Test 
                </Text>
                </>
            }


         </View>
   );
 }
 const styles = StyleSheet.create({
    container: {
        paddingTop:70,
        paddingBottom:100,
        height:300,
        backgroundColor:'blue',
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