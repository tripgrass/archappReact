import React, { useState, useEffect, useRef} from 'react';
import { Platform, Pressable, View, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import CustomButton from '@/components/Button';
import { useSession } from '@/utilities/AuthContext';
import { useNavigation, Link } from 'expo-router';
import  {ArtifactsService}  from '@/utilities/ArtifactsService';
const s = require('@/components/style');
import { usePathname, useRouter, useSegments } from 'expo-router';

export default function ProfileScreen({  artifacts, setArtifacts, artifactId, setArtifactId }) {
    console.log('setArtifactId--------------------------------------------------------------->');
    console.log('setArtifactId', setArtifactId);
    const router = useRouter();
    const { userSession, signOut, signIn } = useSession();
    const pathname = usePathname();
    const navigation = useNavigation();
    const [ activeId, setActiveId ] = useState(null);    
   useEffect(() => {
    /*
        { (userSession) ? (

            ArtifactsService({method:'getAll'})
                .then( (results) => {

                //console.log('RESULTS OF getall',  results)
                    setArtifacts(results)
                })
                .catch((error) => console.log('in profile getall .error', error))
            ) : null }
            */
   }, []);
    const deleteArtifact = async ( id ) => { 
        setActiveId( id );
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
    const webView = ( ) => { 
        return (
            <>
            <View syle={{flexDirection:'row', height:200, backgroundColor:'blue'}}>
        {Object.keys(artifacts).map((key, index) => {
        return (
          <div key={index}>
            <h2>
              {key}: {artifacts[key].name}
            </h2>

            <hr />
          </div>
        );
      })}
    </View>
    </>
        );
    }


   return (
         <View style={{   alignItems: 'center', justifyContent: 'center', paddingTop:40, paddingBottom:10, backgroundColor:'' }}>
            <Text style={{fontSize:16,fontWeight:'700'}}>Artifacts</Text>
                <View style={ ( (Platform.OS === 'web') ? (styles.webView) : (styles.mobileView) ) }>
            
            { (userSession ) ? 

            (   
                (1 != 1 && Platform.OS === 'web') ? 
                    
( webView()
 )                    : 
                    (
                        <View>
                            <FlatList
                                style={{paddingRight:20, marginBottom:0, paddinBottom:0, paddingLeft:20}}
                                data={artifacts}
                                keyExtractor={(item) => String(item.id)}
                                renderItem={({ item, index }) => 
                                    <View key={index} style={{ backgroundColor:'', maxWidth:'1200px', margin:'0 auto', display:'flex', flexWrap:'wrap',flexDirection:'row',width:'100%', alignItems:'center', marginTop:8}}>
                                        <Text style={[ (item.id == activeId ? styles.deleting : null ), {width:'30%',flexGrow: 1}]}>{item.name}-{item.id}</Text>
                                        { (item.images.length > 0 ) ? (
                                        <CustomButton
                                            title="Comp"
                                            styles={{marginRight:5, paddingHorizontal: 10 }}
                                            textStyles={(item.id == activeId ? styles.deleting : null )}
                                            onPress={() => { setArtifactId( item.id); navigation.navigate('compare', {
                                                    params: { artifactId: item.id }
                                                }) 
                                            }}

                                        />      ) : (null) }                          
                                        <CustomButton
                                            title="Edit"
                                            styles={{marginRight:5, paddingHorizontal: 10 }}
                                            textStyles={(item.id == activeId ? styles.deleting : null )}
                                            onPress={() => { setArtifactId( item.id); navigation.navigate('edit', {
                                                    params: { artifactId: item.id }
                                                }) 
                                            }}
                                        />

                                        <CustomButton
                                            title="View"
                                            onPress={() => { setArtifactId( item.id); navigation.navigate('show', {
                                            params: { artifactId: item.id }
                                                }) 
                                            }}
                                            styles={{marginRight:5, paddingHorizontal: 10 }}                                
                                            textStyles={(item.id == activeId ? styles.deleting : null )}
                                        />
                                        <CustomButton
                                            styles={{marginRight:5, paddingHorizontal: 10 }}
                                            textStyles={(item.id == activeId ? styles.deleting : null )}
                                            title="X"
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
                         </View>
                    )   
                ) :
                (
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
                )
            }
            </View>
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
    webView:{
        width:'70%',
        margin:'auto 0',
        height:'100vh',
        overflow:'scroll',
        paddingBottom:100
        //flex:1
    },
    mobileView:{
        //backgroundColor:'red'
    },
    deleting:{
        color: "#d8d8d8"
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