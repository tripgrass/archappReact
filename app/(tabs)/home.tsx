import React, { useState, useEffect, useRef} from 'react';
import { Image, ImageBackground, Pressable, View, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
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

export default function Home({ navigation, initialParams }) {
    const [assets, error] = useAssets( [
            require('../../assets/images/icon.png'), 
            require('../../assets/images/house.jpg'), 
            require('../../assets/images/house2.png'),
    ]);
    containedWithin();
//    console.log('arttifacts in home page', initialParams);
    const loadingIcon = ( assets?.length  ? assets[0] : null );
    const houseImg = ( assets?.length  ? assets[1] : null );
    const houseImg2 = ( assets?.length  ? assets[2] : null );
    const artifix = ( assets?.length  ? assets[3] : null );
const circleButtons = [
    {},{}, {}, {}, {}
];
const artifactsList = initialParams.artifacts;
  const { userSession, signOut } = useSession();

//  console.log('home userSession', userSession);
    return (
        <View style={{ flex: 1, alignItems: '', paddingTop: Constants.statusBarHeight, justifyContent: 'flex-start' }}>
            <View style={{ flex:1, maxHeight:220}}>
                <ImageBackground source={artifix}> 
                    <FlatList contentContainerStyle={{ flexGrow:1, backgroundColor:'', padding:0, marginTop:50 }}
                                            horizontal={true} 
                                            showsHorizontalScrollIndicator={false} 
                                            data={circleButtons}
                                            extraData={circleButtons}
                                            keyExtractor={(item, index) => {return  index.toString();}}
                                            renderItem={ ({ item, index }) => (
                        <Pressable 
                            style={({pressed}) => [
                                            {
                                    backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: 60,
                                    height:120,
                                    width:120,
                                    marginLeft:20,
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
            <View style={{ flex:1, maxHeight:220}}>

<FlatList contentContainerStyle={{ flexGrow:1, backgroundColor:'', padding:0 }}
                                        horizontal={true} 
                                        showsHorizontalScrollIndicator={false} 
                                        data={artifactsList}
                                        extraData={artifactsList}
                                        keyExtractor={(item, index) => {return  index.toString();}}
                                        renderItem={ ({ item, index }) => (
                    <View style={{flex:1, flexDirection:'row', padding:20}}>
                <Image source={ houseImg } /* Use item to set the image source */
                  style={{
                      width:200,
                      height:200,
                      borderRadius:8
                  }}
                    />
                    <View style={{padding:20}}>
                        <Text>{item.name}</Text>
                    </View>
            </View>

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
            <View style={{backgroundColor:'', width:'100%', flexDirection:'row', }}>

    
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
</View>
        </View>
    );
}