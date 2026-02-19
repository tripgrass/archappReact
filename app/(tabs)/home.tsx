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
    const [volume, setVolume] = React.useState(2);
    const [location, setLocation] = React.useState(1);
    const [anthology, setAnthology] = React.useState(1);
    console.log('anthology::::::::::', anthology);
    const LENGTH = Dimensions.get("window").height;
    const HEIGHT = 60;
    const OFFSET = ( Dimensions.get("window").width ) * -.9;
    function updateLocation( value ){
      //update volumes
    }
    function updateVolume( value ){
      setVolume(value);      
    }
    const archiveLayout = {
      locations:[
        {
          'name':'Tucson',
          'value':1,
          'volumes':[
            { label: 'vol  i-coded', value: 1 },
            { label: 'vol  ii', value: 2 },
            { label: 'vol  iii', value: 3 },
            { label: 'vol  iv', value: 4 }            
          ]
        },
        {
          'name':'Portland',
          'value':2,
          'volumes':[
            { label: 'vol  ip', value: 1 },
            { label: 'vol  ip', value: 2 }
          ]          
        }
      ],
      defaults:{
        location:1
      }
    };
    var locationOptions = [];
      console.log('archivelayout: ', archiveLayout.locations);
    for (let index = 0; index < archiveLayout['locations'].length; ++index) {
      console.log('index: ', index);
      console.log('loc: ', archiveLayout.locations[index]);
      var loc = archiveLayout.locations[index];
      if( archiveLayout.defaults.location == loc.value ){
        var defaultLoc = loc;
        var volumeOptions = loc.volumes;
      }
locationOptions.push( { label: loc.name, value: loc.value } );
    };
// need to create variable volumes based on loc:
console.log('voptions', volumeOptions);
useEffect(() => {
//  setVolume();

    console.log('useffect in loc select!!!!!!!!!!!!>>>>>>>:::::::');
  }, []);
    console.log('locationOptions' , locationOptions);
    return (
        <View style={{ 
          flex: 1,
          paddingTop: Constants.statusBarHeight, 
          justifyContent: 'flex-start' }}
        >
          <View style={{ marginBottom:15}}>
            <View style={{  
                  flexDirection: 'row',
                  backgroundColor:'transparent', 
                  width:'100%', position:'absolute', top:18, left:0, zIndex:999}}>
              <View 
                style={{
                  width:120,
                  float:'left',marginLeft:49, marginTop:-15
                }}>
                <Dropdown
                  style={{}}
                  placeholder=""
                  options={volumeOptions}
                  selectedItemStyle={{color:'black', fontSize:28}}
                  isMultiple={false}
                  selectedValue={volume}
                  onValueChange={(value) => updateVolume(value)}
                  primaryColor={''}
                  dropdownStyle={{
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
                      backgroundColor: 'transparent',
                    },
                    sectionHeaderStyle: {
                      padding: 10,
                      backgroundColor: 'transparent',
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
              <Ionicons name="globe-outline" size={35} color="#686868" 
                style={{
                  display:'none',
                  zIndex:9999,
                  float:'right',
                  right:20,
                  position:'absolute',
                  resizeMode: 'contain'
                }} 
              />
<View 
                style={{
                  paddingBottom:0,
                  marginLeft: 'auto',
                  marginBottom:-30,
                  backgroundColor:'transparent',
                }}>
                <Dropdown
                  placeholder=""
                  options={locationOptions}
                  selectedItemStyle={{color:'black', fontSize:16, display:'none'}}
                  isMultiple={false}
                  checkboxControls={{
                    checkboxSize: 24, 
                    checkboxStyle: {}, 
                   // checkboxLabelStyle: TextStyle, 
                   // checkboxComponent?: React.ReactNode, 
                    //checkboxDisabledStyle?: ViewStyle, 
                    //checkboxUnselectedColor?: ColorValue
                  }}
                  selectedValue={location}
                  onValueChange={(value) => setLocation(value)}
                  primaryColor={''}
                  dropdownStyle={{
                    marginRight:-10,
                    backgroundColor:'transparent',
                    borderWidth: 0, // To remove border, set borderWidth to 0
                  }}
                  dropdownIcon={
                                  <Ionicons name="globe-outline" size={35} color="#686868" 
                style={{
                }} 
              />

                  }      
                  dropdownIconStyle={{ top: 20, right: 20 }}
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
                      backgroundColor: 'transparent',
                    },
                    sectionHeaderStyle: {
                      padding: 10,
                      backgroundColor: 'transparent',
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
              }}>
              <Text
                style={{
                    marginTop:10,      
                    fontSize:26,
                    fontWeight:600
                }}
                >   artifix    &#8226;    artifix   &#8226;     artifix   &#8226;   artifix   &#8226;  artifix    &#8226;  artifix
              </Text>
            </View>
          { (1 != 1) ? (                                       
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
                    ) : (null) }
            </View> 
            <View style={{ 
                flex:1,
                marginTop:50,
                flexDirection:'column', 
//                backgroundColor:'#f8f8f8'
              }}>       
              
              <View style={{flex:1,paddingLeft:20,backgroundColor:'transparent',marginTop:40}}>    
                <FlatList 
                    contentContainerStyle={{   }}
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
                                flex:2, 
                                flexDirection:'column', 
                                marginRight:30,
                            }} >
                                <View style={{padding:0}}>
                                    <Text style={{
                                      textAlign:'left', 
                                      marginBottom:7,
                                      marginLeft:10,
                                      fontSize:20, 
                                      fontWeight:400}}>
                                      {item.name}</Text>
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
            </View>
            <View 
              style={{
                backgroundColor:'transparent',
                flex:1, 
                flexDirection:'column', 
                paddingRight:20, 
                alignItems:'center'
              }}>
              <View 
                style={{
                  paddingBottom:0,
                  marginLeft: 'auto',
                  marginBottom:-30,
                  backgroundColor:'transparent',
                }}>
                <Dropdown
                  placeholder=""
                  options={[
                    { label: 'Anthology One', value: 1 },
                    { label: 'Anthology Two', value: 2 },
                    { label: 'Anthology Three', value: 3 },
                  ]}
                  selectedItemStyle={{color:'black', fontSize:16}}
                  isMultiple={false}
                  selectedValue={anthology}
                  onValueChange={(value) => setAnthology(value)}
                  primaryColor={''}
                  dropdownStyle={{
                    marginRight:-10,
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
                      backgroundColor: 'transparent',
                    },
                    sectionHeaderStyle: {
                      padding: 10,
                      backgroundColor: 'transparent',
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
              <Image 
                source={ houseImg2 }
                style={{
                    marginLeft:'auto',
                    width:200,
                    height:200,
                    borderRadius:20
                }}
              />
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