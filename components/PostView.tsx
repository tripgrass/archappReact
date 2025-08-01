import { Button, Dimensions, Image, Keyboard, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView } from 'react-native';
import Checkbox from 'expo-checkbox';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState, useRef, useCallback } from 'react';
import CustomButton from '@/components/Button';
import {ImagesService}  from '@/utilities/ImagesService';
import { useIsFocused } from '@react-navigation/native';
import { AutocompleteDropdown , AutocompleteDropdownContextProvider} from 'react-native-autocomplete-dropdown';
import _ from "lodash";
import { LogBox } from 'react-native';
import RenderHtml from 'react-native-render-html';

import { useForm, Controller } from 'react-hook-form';

const s = require('@/components/style');
export default function App({ artifactId, artifactPrimaryImageId, galleryState, galleryStateChanger, slideoutState, setslideoutState, postState, setPostState, photographers }) {
    const [defaultValues, setDefaultValues] = useState({});
    const { register, setError, getValues, setValue, getValue, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues:defaultValues
    }); 
    const [currentPostId, setCurrentPostId] = useState( ( postState?.id ? postState.id : null ));    
    const [keyboardHeight, setKeyboardHeight] = useState(0);    
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);  
    const isFocused = useIsFocused()
    const [isLoaded, setIsLoaded] = useState(false);
    const [loading, setLoading] = useState(false)
    const [suggestionsList, setSuggestionsList] = useState(photographers ? photographers : null)
    const notificationBarHeight = 50;
    const [isPrimary, setIsPrimary] = useState( (artifactPrimaryImageId == postState?.id ) ? true : false );
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemTitle, setSelectedItemTitle] = useState(null);
//const [source, setSource] = useState( postState?.content ? { html: postState?.content } : { html: "empty"} );
const source = {
  html: (postState?.content ? postState?.content : "<p>empty</p>") 
/*
<p style='text-align:center;'>
  <b>Hello World!</b>
</p>`*/
};
  //  console.log('suggestionsList', suggestionsList);
//console.log('in imagemeta TSXimageState.person_id', imageState.person_id);
//console.log('imageState', imageState);
//console.log('artifactPrimaryImageId', artifactPrimaryImageId);
console.log('galleryState', galleryState);
    useEffect(() => {
        // hides development popup warning for autocompletedropdown in scrollview
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

        console.log('defaultValues', defaultValues);
        console.log('defaultValues.lenngth', Object.keys(defaultValues).length);
        /*
        if( Object.keys(defaultValues).length < 1 && !isLoaded){
            Object.keys(formFields).forEach((k, i) => {
                if('null' !== imageState[k] && "undefined" !== typeof imageState[k]){
                    console.log(k + "--> " + imageState[k]);
                    // api is returing null as string  - should clean that up at the api
                    if( Number.isInteger(imageState[k]) ){
                        var val = JSON.stringify(imageState[k]);
                    }
                    else{
                        var val = imageState[k];                        
                    }
                    defaultValues[k] = val;
                }
            });    
            setDefaultValues(defaultValues);
            reset({ ...defaultValues });
            setIsLoaded(true);
        }
        console.log('defaultValues after', defaultValues);
*/
        // setup keyboard handling
        const showSubscription = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
        const hideSubscription = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

        if( selectedItem && photographers ){
            Object.keys(photographers).forEach((k, i) => {
                if( selectedItem == photographers[k].id ){
                    var selectedItemTitle = photographers[k].title;
                    setSelectedItemTitle(selectedItemTitle);
                }
            });
        }

        // conditional seemed wrong;  was (imageState.id !== currentImageId);  
        if( postState?.id  ){
            if( postState.id == currentImageId ){
                console.log('USE EFFECT :::>>>>>>>>>>>>>>>>>>>>> IMAGEsTATE', postState);
                setCurrentImageId( postState.id );
                console.log( 'postState?.content :::::::' , postState?.content);

                //setValue('year', imageState?.year ? imageState?.year : null );
                //setValue('title', imageState?.title ? imageState?.title : null );
            }
            if( artifactPrimaryImageId && artifactPrimaryImageId == postState.id ){
                //setIsPrimary( true );    
            }
        }
        return () => {
            showSubscription.remove();
        };
    })



  const dropdownController = useRef(null)

  const searchRef = useRef(null)

  const getSuggestions = useCallback(async q => {
    
    const filterToken = q.toLowerCase();
    console.log('getSuggestions', q)
    if (typeof q !== 'string' || q.length < 2) {
      setSuggestionsList(photographers)
      return
    }
    const suggestions = photographers
      .filter(item => item.title.toLowerCase().includes(filterToken))
      .map(item => ({
        id: item.id,
        title: item.title,
      }))
    setSuggestionsList(suggestions)
    
  }, [])

  const onClearPress = useCallback(() => {
    setSuggestionsList(photographers)
  }, [])

  const onOpenSuggestionsList = useCallback(isOpened => {

    console.log('IS OPENININGIN');
  }, [])    
    const handleKeyboardShow = event => {
        console.log('handlekey show');
       // setIsKeyboardVisible(true);
//        console.log('handle setIsKeyboardVisible', isKeyboardVisible);
        setKeyboardHeight(event.endCoordinates.height);
        console.log('keyboardHeight', keyboardHeight);
    };
    const onFocusKeyboard = event => {
        console.log('onFocusKeyboard');
          setIsKeyboardVisible(true);            
    }
    const onFocusKeyboardBlur = event => {
        //    setIsKeyboardVisible(false);            
    }
    const handleKeyboardHide = event => {
        console.log('handle hide');
        //setKeyboardHeight(0);
        setIsKeyboardVisible(false);
    }; 
    const updateImageMeta = data => {

        var form = new FormData();
        Object.keys(galleryState).forEach((k, i) => {
            if( imageState.counter && imageState.counter == galleryState[k].counter ){
                if( imageState ){
                    console.log('add to galleryState 175', imageState);
                    galleryState[k] = imageState;
                }
            }
        });        
        toggleSlideout();               
    };

function clearYear() {

}
function setHeight(){
    var screenHeight = Dimensions.get("window").height;
        var newHeight = screenHeight - keyboardHeight;
        return newHeight;
}
function toggleSlideout() {
    Keyboard.dismiss();
    setslideoutState(  "out" == slideoutState ? "in" : 'out' );
           // setValue('year', "2024");
            console.log("getValues('root.year')");
            console.log(getValues('root'));

}
    return (
        <>
            <View 
                style={[ 
                    ('out' == slideoutState) ? (
                        {
                            color:'white',
                            width:'100%',
                            marginTop:-76,
                            flex:1,
                        //        backgroundColor:'red'
                        }
                    ) : (
                        {
                            display:'none'
                        }
                    ),
                    ('out' == slideoutState) ? (  isKeyboardVisible  ? 
                        { 
                            height:setHeight(), 
                            //marginTop: (-1 * ( notificationBarHeight + 140))
                        } : 
                        {
                            backgroundColor:'',
                            flex:1,
                            flexDirection:'row',
                            justifyContent:'flex-end'
                        } 
                    ) : 
                        {
                            backgroundColor:''
                        },
                        { 
                             backgroundColor:'' 
                        }
                ]} >
                <ScrollView
                    keyboardShouldPersistTaps='handled'
                    style={[
                        {
                            width:'100%', 
                            backgroundColor:''  
                            //paddingBottom:60
                        },
                        (  isKeyboardVisible  ? 
                            { 
                                 backgroundColor:'', 
                            } : (null) ) 
                    ]}
                    contentContainerStyle={ [ {/*backgroundColor:'yellow'*/}, ('out' == slideoutState) ? {
                        elevation: 4,  
                        transition: '3s',        
                        justifyContent: 'right',
                        top: notificationBarHeight + 30,
                        marginTop: notificationBarHeight,
                        right: 0, 
                        width: '98%',
                        padding:20,
                        position:'absolute',
                        borderColor:'#d8d8d8',
                        borderWidth:1,  
                        borderWidthTop:0,
                        //height: 300,
                        shadowColor: "#000",
                        shadowOffset: {
                            width: 10,
                            height: 20,
                        },
                        backgroundColor:'white',
                        shadowOpacity: 1,
                        shadowRadius: 3.84,
//                        paddingBottom:100
                    } : styles.wrapper, 
                    (  isKeyboardVisible  ? { 
                        paddingBottom:( notificationBarHeight + 500 ),
//                        backgroundColor:'blue', 
                    } : (null) )
                    ]}> 
                <View style={{flex:1, flexDirection:'row', marginBottom:30}}>

                        <TouchableOpacity
                            onPress={toggleSlideout}
                            style={{
                                height: 50,
                                right:0,
                                position:'absolute',
                                width: 50,
                                top:0,
                                zIndex:9,
                                backgroundColor:'white'
                            }}
                        >
                            <Ionicons name="close-outline" size={50} color="black" style={{
                                display:'flex-inline',
                                height:50,
                                width:50,
                            }}/>
                        </TouchableOpacity>                                                                      
                </View>                
                <View style={ {height:'auto', /*backgroundColor:'red',*/ flex:1}} >

                    <View style={{flex:1, flexDirection:'row'}}>
                        
                        <Text style={{
//                            display:'none',
                            marginTop:0, 
                            fontSize: 14,
                            maxWidth:'70%',
                            color: 'black',
                            paddingLeft:20                            
                        }}>{postState?.post_title}</Text>
                        <Text style={{
                            display:'none',
                            marginTop:0, 
                            fontSize: 14,
                            maxWidth:'70%',
                            color: 'black',
                            paddingLeft:20                            
                        }}></Text>
<RenderHtml
      contentWidth={50}
      source={source}
    />
                    </View>
                                       



                    <View style={{flex:1, flexDirection:'row', marginTop:5, marginBottom:5, zIndex:-1}}>

                    </View>
                </View>
            </ScrollView>
        
            </View>
        </>
    );
}
const styles = StyleSheet.create({
    mainWrapper:{

    },
    mainWrapperOut:{
      

    },
          
    wrapper:{
        marginTop:0,
    },
    wrapperOut:{
        
    },
  containerVoid: {
},
  containerOutVoid: {
},

  container: {
    flex: 1,
    backgroundColor:'white',
    position: 'absolute',
    top:0,
    right: -280, 
    height:0,
    width: '80%', 
    transition: '3s'
  },
  containerOut: {
    flex: 1,
    position: 'absolute',
    top:0,
    right: 0, 
    width: '92%',
    padding:20,
    minHeight:300,  
    borderColor:'#d8d8d8',
    borderWidth:1,  
    borderWidthTop:0,
    //height: 300,
   /*
    shadowColor: "#000",
    shadowOffset: {
        width: 10,
        height: 20,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,
    */
    elevation: 4,    
    backgroundColor:'white',
    transition: '3s',
  },  
  text: {
    fontSize: 12,
    color: 'black',
    maxWidth:'60%',
    marginTop:20,
    paddingLeft:20
  },
  plus: {
    position: "absolute",
    left: 15,
    top: 10,
  },
input: {
    display: "flex",
    flexShrink: 0,
    flexGrow: 0,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#c7c6c1",
    paddingVertical: 13,
    paddingLeft: 12,
    paddingRight: "5%",
    width: "100%",
    justifyContent: "flex-start",
  },  
});

