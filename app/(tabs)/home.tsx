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
    const loadingIcon = ( assets?.length  ? assets[0] : null );
    const houseImg = ( assets?.length  ? assets[1] : null );
    const houseImg2 = ( assets?.length  ? assets[2] : null );
    const artifix = ( assets?.length  ? assets[3] : null );
    const circleButtons = [
        {},{}, {}, {}, {}
    ];
    var initAnthologySelect = 2;
    const [anthologySelect, setAnthologySelect] = React.useState( initAnthologySelect ); // number value of chose option
console.log("anthologySelect", anthologySelect);
    var artifactsList = (initialParams.collections && initialParams.collections[1] && initialParams.collections[1].artifacts) ? initialParams.collections[1].artifacts : initialParams.artifacts;
    const artifactId = initialParams.artifactId;
    const setArtifactId = initialParams.setArtifactId;
    const { userSession, signOut } = useSession();
    const [volumeSelect, setVolumeSelect] = React.useState(1);
const [volume, setVolume] = React.useState( {} );
    const [anthologyOptions, setAnthologyOptions] = React.useState( [] );

    const space = "   ";
    const LENGTH = Dimensions.get("window").height;
    const HEIGHT = 60;
    const OFFSET = ( Dimensions.get("window").width ) * -.9;
    function getLocation( id ){
      for (let index = 0; index < archiveLayout['locations'].length; ++index) {
        var loc = archiveLayout.locations[index];
        if( id == loc.value ){
          return loc;
        }
      };      
      return false;
    }
    function getVolume( volumeObjects, id ){
      for (let index = 0; index < volumeObjects.length; ++index) {
        var object = volumeObjects[index];
        if( id == object.value ){
          return object;
        }
      };      
      return false;
    }
    function getAnthology( anthologyObjects, id ){
      
      for (let index = 0; index < anthologyObjects.length; ++index) {
        var object = anthologyObjects[index];
        if( id == object.id ){
          return object;
        }
      };      
      return false;
    }    
    function updateLocation( value ){
      if( location && location.value != value ){
        loc = getLocation( value );
        setLocation( loc );
        volumeOptions = loc.volumes;
        setVolumeSelect(1);
        var volObject = getVolume( volumeOptions, 1 );

        var anthologyIds = volObject.anthologies;
        var tempAnthologyOptions = [];
        for (let index = 0; index < anthologyIds.length; ++index) {
          var anthology = initialParams.collections[ anthologyIds[index] ] ? initialParams.collections[ anthologyIds[index] ] : null;
          if( anthology ){
            tempAnthologyOptions.push({ "label": anthology.name, "value": anthology.id });
          }
        }
        setAnthologySelect( tempAnthologyOptions[0].value );        
        setAnthologyOptions( tempAnthologyOptions );
        setLocation( loc );
        setVolume( volObject );                  
      }
    }
    function buildAnthologySelect( anthologyIds ){
        var tempAnthologyOptions = [];
        for (let index = 0; index < anthologyIds.length; ++index) {
          var anthoObject = getAnthology( initialParams.collections, anthologyIds[index] );
          var anthology = anthoObject;
          if( anthology ){
            tempAnthologyOptions.push({ "label": anthology.name, "value": anthology.id });
          }
        }
        return tempAnthologyOptions;
    }
    function updateVolumeObject( value ){
        var volObject = getVolume( volumeOptions, value );
        var anthologyIds = volObject.anthologies;
        
        //var tempAnthologyOptions = buildAnthologySelect( anthologyIds );
 var tempAnthologyOptions = [];
 console.log("start------->");
 console.log("initialParams.collections", initialParams);
        for (let index = 0; index < anthologyIds.length; ++index) {
          var anthoObject = getAnthology( initialParams.collections, anthologyIds[index] );
          var anthology = anthoObject;
          console.log(";init to win it", index);
          console.log(";init to win it", anthology);
          if( anthology ){
            tempAnthologyOptions.push({ "label": anthology.name, "value": anthology.id });
          }
        }        
         console.log("end------->");

        console.log("tempAnthologyOptions",tempAnthologyOptions)
        volObject.anthologySelect = tempAnthologyOptions; 
        setVolume( volObject );
        console.log('volObject', volObject);
        setAnthologyOptions( volObject.anthologySelect );
        console.log('setAnthologyOptions', anthologyOptions);
        if( volObject.anthologySelect.length ){
          setAnthologySelect( volObject.anthologySelect[0].value );
        }
    }
    function updateVolume( value ){
        setVolumeSelect(value );
        updateVolumeObject( value );
    }
    function updateAnthology( value ){
      console.log("update anthology!!!!!!!!!!!!", value);
        setAnthologySelect(value );
    }

    const archiveLayout = {
      locations:[
        {
          'name':'Tucson',
          'value':1,
          'volumes':[
            { label: 'vol  i-coded', value: 1,anthologies:[2,1] },
            { label: 'vol  ii', value: 2,
              anthologies:[1,2] 
             },
            { 
              label: 'vol  iii', 
              value: 3,
              anthologies:[2]               
             },
            { label: 'vol  iv', value: 4,
               anthologies:[1]  
             }            
          ]
        },
        {
          'name':'Portland',
          'value':2,
          'volumes':[
            { label: 'vol  ip', value: 1,anthologies:[1,2] },
            { label: 'vol  2p', value: 2 ,anthologies:[1]}
          ]          
        }
      ],
      defaults:{
        location:1,
        initialAnthology:1
      }
    };
    const defaultLocationValue = archiveLayout.defaults.location;
    var locationOptions = [];
    for (let index = 0; index < archiveLayout['locations'].length; ++index) {
      var loc = archiveLayout.locations[index];
      if( archiveLayout.defaults.location == loc.value ){
        var defaultLoc = loc;
      }
      locationOptions.push( { label: loc.name, value: loc.value } );
      if( loc.value == defaultLocationValue){
        var defaultLocation = loc;
      }
    };
    const [location, setLocation] = React.useState(defaultLocation ? defaultLocation : {});
    var volumeOptions = location.volumes;
        const initAnthoOptions = [];
    initAnthoOptions.push( {"label": "init", "value": 2} );
    initAnthoOptions.push( {"label": "other init TestCollect", "value": 1} );
console.log('antho options line 198:', initAnthoOptions);


useEffect(() => {
  console.log("useeffect", initialParams);
    updateVolumeObject( volumeSelect );
    var volObject = getVolume( volumeOptions, volumeSelect );
    var anthologyIds = volObject.anthologies;
    var tempAnthologyOptions = buildAnthologySelect( anthologyIds );    
    volObject.anthologySelect = tempAnthologyOptions; 
    //var anthVal = (volObject.anthologySelect.length > 0 && volObject.anthologySelect[0].value) ? volObject.anthologySelect[0].value : 2;
      console.log( "anthologyOptions volobject" , volObject.anthologySelect );
console.log('antho:::::::::::::::::options', anthologyOptions);

  if( anthologyOptions.length && anthologyOptions[0] && "undefined" != typeof anthologyOptions[0].value ){
   // setAnthologySelect( anthologyOptions[0].value );
  }
    console.log('useffect in loc select!!!!!!!!!!!!>>>>>>>:::::::' , anthologyOptions[0]);
  }, []);
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
                  width:220,
                  float:'left',marginLeft:49, marginTop:-15
                }}>
                <Dropdown
                  style={{}}
                  placeholder=""
                  options={volumeOptions}
                  selectedItemStyle={{color:'black', fontSize:28}}
                  isMultiple={false}
                  selectedValue={volumeSelect}
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
                  marginTop:-18,
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
                  selectedValue={location.value}
                  onValueChange={(value) => ( value ? updateLocation(value) : null ) }
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
                >artifix{space}&#8226;{space}artifix{space}&#8226;  {space}{location.name}  {space}&#8226;{space}artifix{space}&#8226;{space}artifix{space}&#8226;  artifix    &#8226;  artifix
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
                //paddingLeft:60,
                marginTop:50,
                flexDirection:'column', 
//                backgroundColor:'#f8f8f8'
              }}>       
              
              <View style={{flex:1,backgroundColor:'transparent',marginTop:55,                
              //paddingLeft:60,
}}>    
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
                                marginRight:20,
                                marginLeft:10,
                                paddingLeft:30
                            }} >
                                <View style={{padding:0}}>
                                    <Text style={{
                                      textAlign:'left', 
                                      marginBottom:-67,
                                      zIndex:999,
                                      left:-15,
                                      padding:12,
                                      paddingLeft:16,
                                      borderRadius:4,
//                      borderColor: '#c0c0c0',
  //                    borderWidth: 1,

                                      //display:'inline-block',
                                      backgroundColor:'rgba(255,255,255,.6)',
                                      fontSize:20, 
                                      fontWeight:500}}
                                    >  
                                      {item.name}
                                    </Text>
                                </View>
                                <Image source={{uri:imageBaseUrl + ( (item.images && item.images[0]) ? item.images[0].name : null)  }} /* Use item to set the image source */
                                    style={{
                                        width:200,
                                        height:200,
                                        borderRadius:100,
                                        borderColor:'rgba(255,255,255,.6)',
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
                  options={ anthologyOptions.length ?  anthologyOptions :  initAnthoOptions }
                  selectedItemStyle={{color:'black', fontSize:16}}
                  isMultiple={false}
                  selectedValue={anthologySelect }
                  onValueChange={(value) => updateAnthology(value)}
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