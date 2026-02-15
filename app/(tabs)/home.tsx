import React, { useState, useEffect, useRef} from 'react';
import {Button, Dimensions, Image, ImageBackground, Pressable, View, Text, ScrollView, StyleSheet, FlatList } from 'react-native';
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
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Dropdown from 'react-native-input-select';
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Home({ initialParams }) {
    const imageBaseUrl = "https://zkd.b51.mytemp.website/images/";
    const [assets, error] = useAssets( [
            require('../../assets/images/icon.png'), 
            require('../../assets/images/house.jpg'), 
            require('../../assets/images/house2.png'),
    ]);
    containedWithin();
    const navigation = useNavigation();
const [selectedLanguage, setSelectedLanguage] = useState();
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
 const [country, setCountry] = React.useState(2);
const LENGTH = Dimensions.get("window").height;
const HEIGHT = 60;
const OFFSET = ( Dimensions.get("window").width ) * -.9;
    return (
        <View style={{ flex: 1, alignItems: '', paddingTop: Constants.statusBarHeight, justifyContent: 'flex-start' }}>
            <View style={{ flex:1, marginBottom:30}}>

                <View style={{  flexDirection: 'row',
                  justifyContent:'flex-start',
                  flexWrap: 'wrap',
                  backgroundColor:'transparent', width:'100%', position:'absolute', top:18, left:0, zIndex:999}}>
              <View style={{width:120, float:'left',marginLeft:49, marginTop:-15}}>
                <Dropdown
                style={{color:'blue'}}
      placeholder=""
      options={[
        { label: 'vol  i', value: 1 },
        { label: 'vol  ii', value: 2 },
        { label: 'vol  iii', value: 3 },
        { label: 'vol  iv', value: 4 }
      ]}
      selectedItemStyle={{color:'black', fontSize:28}}
      isMultiple={false}
      selectedValue={country}
      onValueChange={(value) => setCountry(value)}
      primaryColor={''}
        dropdownStyle={{
//            backgroundColor:'#f0f0f0',
            backgroundColor:'transparent',
  
        borderWidth: 0, // To remove border, set borderWidth to 0
      }}
    dropdownIcon={
        <Text style={{color:'grey'}}> &#9660;</Text>
      }      
      dropdownIconStyle={{ top: 20, right: 20, display:'none' }}
      listHeaderComponent={
        <View style={styles.customComponentContainer}>
          <Text style={{textAlign:'center'}}>
          </Text>
          
        </View>
      }
      modalControls={{
        modalOptionsContainerStyle: {
          padding: 10,
          backgroundColor: '',
        },
        modalProps: {
          supportedOrientations: [
            'portrait',
            'portrait-upside-down',
            'landscape',
            'landscape-left',
            'landscape-right',
          ],
          transparent: true,
        },
      }}
      listComponentStyles={{
        listEmptyComponentStyle: {
          color: 'red',
        },
        itemSeparatorStyle: {
          opacity: 0,
          borderColor: 'white',
          borderWidth: 2,
          backgroundColor: 'cyan',
        },
        sectionHeaderStyle: {
          padding: 10,
          backgroundColor: 'cyan',
        },
      }}
      listControls={{
        selectAllText: 'Choose everything',
        unselectAllText: 'Remove everything',
        selectAllCallback: () => Alert.alert('You selected everything'),
        unselectAllCallback: () => Alert.alert('You removed everything'),
        emptyListMessage: 'No record found',
      }}
      selectedItemsControls={{
        removeItemIcon: (
          <Image
            source={{
              uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA',
            }}
            style={{ tintColor: 'white', height: 12, width: 12 }}
          />
        ),
        onRemoveItem: () => Alert.alert('Item was removed'),
        showRemoveIcon: true,
      }}      
    /> 
    </View>
 <Ionicons name="globe-outline" size={35} color="#686868" style={{
            display:'block',
            zIndex:9999,
            float:'right',
            right:20,

            position:'absolute',
            //left:58,
            //top:20,
            resizeMode: 'contain'
            }} />


    </View>          
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
                    >artifix1    &#8226;artifix2    &#8226;      artifix3   &#8226;      artifix   &#8226;    artifix   &#8226;  artifixlast   &#8226; 

                    </Text>


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
const styles = StyleSheet.create({
  customComponentContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  text: {
    marginBottom: 20,
  },
  fixToText: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  tinyLogo: {
    width: 20,
    height: 20,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 20 / 2,
    borderWidth: 3,
    borderColor: 'white',
  },
});