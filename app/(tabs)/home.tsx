import React, { useState, useEffect, useRef} from 'react';
import { Dimensions, Image, ImageBackground, Pressable, View, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import CustomButton from '@/components/Button';
import { useSession } from '@/utilities/AuthContext';
import { useNavigation, Link } from 'expo-router';
import  {ArtifactsService}  from '@/utilities/ArtifactsService';
import  { containedWithin }  from '@/utilities/ArtifactsFilters';
const s = require('@/components/style');
import { usePathname, useRouter, useSegments } from 'expo-router';
import { Asset, useAssets } from 'expo-asset';
import Constants from 'expo-constants';

export default function Home({ initialParams }) {
    const imageBaseUrl = "https://zkd.b51.mytemp.website/images/";
    const [assets, error] = useAssets( [
            require('../../assets/images/icon.png'), 
            require('../../assets/images/house.jpg'), 
            require('../../assets/images/house2.png'),
    ]);
    containedWithin();
    const navigation = useNavigation();

//    console.log('initParams!!!! in home page posts:', initialParams);
    const loadingIcon = ( assets?.length  ? assets[0] : null );
    const houseImg = ( assets?.length  ? assets[1] : null );
    const houseImg2 = ( assets?.length  ? assets[2] : null );
    const artifix = ( assets?.length  ? assets[3] : null );
const circleButtons = [
    {},{}, {}, {}, {}
];
const artifactsList = initialParams.artifacts;
const artifactId = initialParams.artifactId;
const setArtifactId = initialParams.setArtifactId;
  const { userSession, signOut } = useSession();
//  console.log('home userSession', userSession);
  /*
  */
const LENGTH = Dimensions.get("window").height;
const HEIGHT = 60;
const OFFSET = ( Dimensions.get("window").width ) * -.9;
    return (
        <View style={{ flex: 1, alignItems: '', paddingTop: Constants.statusBarHeight, justifyContent: 'flex-start' }}>
            <View style={{ flex:1, marginBottom:30}}>
                <View  
                style={{
                    transform: [
                        { rotate: "270deg" }, 
                        { translateX:  -1 * Dimensions.get("window").width }, 
                        { translateY: OFFSET }
                        ],
                    width: LENGTH,
                    height: HEIGHT,                    
                    backgroundColor:'#A89644',
                     borderBottomWidth: 5,
                    borderBottomColor: "#cfb546"
                }}
                >
                    <Text
                    style={{
                        marginTop:10,      
                        fontSize:26,
                        fontWeight:600
                    }}
                    >artifix    &#8226;  artifix   &#8226;   artifix   &#8226;      artifix   &#8226;      artifix   &#8226;    artifix   &#8226; artifix   &#8226; artifix   &#8226; </Text>
                    </View>
                <ImageBackground source={artifix}
                    style={{
                        backgroundColor:''
                    }}
                > 
                    <FlatList 
                            contentContainerStyle={{ 
                                flexGrow:1, 
                                backgroundColor:''
                            }}
                            horizontal={true} 
                            showsHorizontalScrollIndicator={false} 
                            data={circleButtons}
                            extraData={circleButtons}
                            keyExtractor={(item, index) => {return  index.toString();}}
                            renderItem={ ({ item, index }) => (
                        <Pressable 
                            style={({pressed}) => [
                                            {
                                    backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'rgb(210, 210, 210)',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 60,
                                    height:120,
                                    width:120,
                                    marginLeft:20,
                                    marginTop:20,
                                    marginBottom:20,
                                    elevation: 3,
                                    boxShadow: '0px 2px 2px #d8d8d8'                                
                                            }
                            ]}
                            onPress={ () => { console.log('do aomwrhing') }}

                        >
                            <Image source={ loadingIcon } /* Use item to set the image source */
                          style={{
                              width:100,
                              height:100,
                              borderRadius:50
                          }}
                            />
                        </Pressable>

                                            )}
                    >
                    </FlatList>
                </ImageBackground>
            </View> 
            <View style={{ flex:2}}>
                <FlatList contentContainerStyle={{  marginTop:30, padding:0 }}
                    horizontal={true} 
                    showsHorizontalScrollIndicator={false} 
                    data={artifactsList}
                    extraData={artifactsList}
                    keyExtractor={(item, index) => {return  index.toString();}}
                    renderItem={ ({ item, index }) => (
                        <Pressable 
                            style={({pressed}) => []}
                            onPress={ () => {
                                setArtifactId( item.id); 
                                navigation.navigate('show', {
                                    params: { artifactId: item.id }
                                }) 
                            }}
                        >                                               
                            <View style={{
                                flex:1, 
                                flexDirection:'column', 
                                margin:20,
                            }} >
                                <View style={{padding:0}}>
                                    <Text style={{textAlign:'center', marginBottom:7,fontSize:20, fontWeight:700}}>{item.name}</Text>
                                </View>
                                <Image source={{uri:imageBaseUrl + ( (item.images && item.images[0]) ? item.images[0].name : null)  }} /* Use item to set the image source */
                                    style={{
                                        width:200,
                                        height:200,
                                        borderRadius:100,
                                borderColor:'white',
                                borderWidth:5,
                                borderRadius:100

                                    }}
                                />

                            </View>
                        </Pressable> 

                    )}
                >
                </FlatList>         
            </View>
            <View style={{flex:1, flexDirection:'row', padding:20, alignItems:'center', justifyContent:'center'}}>
                    <View style={{padding:20}}>
                        <Text>House</Text>
                    </View>
                <Image source={ houseImg2 } /* Use item to set the image source */
                  style={{
                      width:200,
                      height:200,
                      borderRadius:8
                  }}
                    />
            </View>
            <View style={{backgroundColor:'', minHeight:20, width:'100%', flexDirection:'row', }}>

            { (1 != 1) ? (
    <>
            <CustomButton styles={{width:'30%'}} title="Edit" onPress={() => navigation.navigate('/artifacts/edit')} />
            <CustomButton styles={{width:'30%'}} title="Go to Map" onPress={() => navigation.navigate('map')} />
            { (userSession) ? (

                <CustomButton title="Sign Out" 
                    style={{margin:20}}
                onPress={() => {
                  // The `app/(app)/_layout.tsx` will redirect to the sign-in screen.
                  signOut();
                }} />
               ) : <CustomButton title="Sign In" 
                    style={{margin:20}}
                onPress={() => navigation.navigate('SignIn')} />
            }                
    </>

            ) : (<></>) }

</View>
        </View>
    );
}