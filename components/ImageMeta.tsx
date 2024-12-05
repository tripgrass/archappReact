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

import { useForm, Controller } from 'react-hook-form';

const s = require('@/components/style');
export default function App({ artifactId, galleryState, galleryStateChanger, slideoutState, setslideoutState, imageState, setImageState, photographers }) {
    let defaultValues = {};
//    console.log('prop!!!! PhotographERS' , photographers);
    const { register, setError, getValues, setValue, getValue, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues:defaultValues
    }); 
    const [currentImageId, setCurrentImageId] = useState( ( imageState?.id ? imageState.id : null ));    
    const [keyboardHeight, setKeyboardHeight] = useState(0);    
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);  
    const isFocused = useIsFocused()

    const [loading, setLoading] = useState(false)
    const [suggestionsList, setSuggestionsList] = useState(photographers)
    const notificationBarHeight = 50;
useEffect(() => {
    LogBox.ignoreLogs(['VirtualizedLists should never be nested']);
}, [])
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
    shadowColor: "#000",
    shadowOffset: {
        width: 10,
        height: 20,
    },
    shadowOpacity: 1,
    shadowRadius: 3.84,

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

    
    
    /* 
useEffect(() => {
    console.log('imageState', imageState);
    console.log('>>>>>>>>>>>>');
    console.log('>>>>>>>>>>>>');
    console.log('>>>>>>>>>>>>');
    console.log('>>>>>>>>>>>>');
    console.log('>>>>>>>>>>>>');
    console.log('>>>>>>>>>>>>');
    console.log('>>>>>>>>>>>>');
    if( imageState ){
        console.log('!!!!!!!!!!!!!has Image state!', imageState);
        defaultValues.name = imageState?.name;
        defaultValues.year = "2025";
        if( imageState?.year || !imageState.year ){
            //defaultValues.year = imageState.year;
        }
    }
    console.log('image defaultValues', defaultValues);
    reset({ ...defaultValues });
  }, []); 
 */   

  //  console.log( getValues() );

    const [isChecked, setChecked] = useState(false);
    useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
        const hideSubscription = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

        return () => {
            showSubscription.remove();
        };
    }, []);
    useEffect(() => {
        if( imageState?.id && imageState.id !== currentImageId ){
            setCurrentImageId( imageState.id );
            console.log('USE EFFECT ::: IMAGEsTATE', imageState);
            setValue('year', imageState?.year ? JSON.stringify(imageState?.year) : null );
            setValue('title', imageState?.title ? imageState?.title : null );
        }
    })


  const [selectedItem, setSelectedItem] = useState(null)
  const dropdownController = useRef(null)

  const searchRef = useRef(null)

  const getSuggestions = useCallback(async q => {
    
    const filterToken = q.toLowerCase();
    console.log('getSuggestions', q)
    if (typeof q !== 'string' || q.length < 2) {
      setSuggestionsList(photographers)
      return
    }
//    setLoading(true)
//    const response = await fetch('https://jsonplaceholder.typicode.com/posts')
  //  const items = await response.json()
    //console.log('items',items);
  //  console.log('photographes', photographers);
    const suggestions = photographers
      .filter(item => item.title.toLowerCase().includes(filterToken))
      .map(item => ({
        id: item.id,
        title: item.title,
      }))
      console.log(suggestions);
    setSuggestionsList(suggestions)
  //  setLoading(false)
    
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
        console.log('updateImage Data', data);
        console.log('updateImage imageState', imageState);
        form.append('year',data.year);
        form.append('title', data.title);
        if( imageState?.id ){
            // you're editing an existing db image 
            form.append('id',imageState.id);
        }
        else{

        }
        /*
        if( userSession ){
            var parsedUserSession = JSON.parse(userSession);
            form.append('user_name', parsedUserSession?.user?.name );
            form.append('user_email', parsedUserSession?.user?.email );
        }
                        
        */
                ImagesService({
                    method:'create',
                    id:imageState.id,
                    data:form
                })
                .then( result => {
                    console.log(result);
                    /*
                    const cloneDeep = _.cloneDeep(galleryState);
                    Object.keys(cloneDeep).forEach((k, i) => {
                        if( imageState.id  == cloneDeep[k].id ){
                            cloneDeep.splice(k);
                        }
                    });            
                    galleryStateChanger( cloneDeep );                    
                    toggleSlideout();                    
                    */
                })
                .catch( console.log('IN INITIAL EDIT.TSX .error')) 

    };    
    const removeImage = data => {
        var form = new FormData();
        form.append('artifact_id', (artifactId ? artifactId : null));
        if( imageState?.id ){
            // you're editing an existing db image 
            form.append('id',imageState.id);
        }
        else{

        }
        console.log('DE;ETE');
        /*
        if( userSession ){
            var parsedUserSession = JSON.parse(userSession);
            form.append('user_name', parsedUserSession?.user?.name );
            form.append('user_email', parsedUserSession?.user?.email );
        }
                             
        */
                ImagesService({
                    method:'delete',
                    artifact_id:artifactId,
                    id:imageState.id
                })
                .then( result => {
                    console.log(result);
                    const cloneDeep = _.cloneDeep(galleryState);
                    Object.keys(cloneDeep).forEach((k, i) => {
                        if( imageState.id  == cloneDeep[k].id ){
                            cloneDeep.splice(k);
                        }
                    });            
                    galleryStateChanger( cloneDeep );                    
                    toggleSlideout();                    
                })
                .catch( console.log('IN INITIAL EDIT.TSX .error')) 

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
                            marginTop: (-1 * ( notificationBarHeight + 20))
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
                    } : styles.wrapper, 
                    (  isKeyboardVisible  ? { 
                        paddingBottom:( notificationBarHeight + 150 ),
//                        backgroundColor:'blue', 
                    } : (null) )
                    ]}> 
                <View style={{flex:1, flexDirection:'row', marginBottom:30}}>
                        <CustomButton
                            styles={{
                                borderRadius: 0,
                                elevation: 3,
                                color:'black',
                                marginTop:0
                            }}                      
                            title={ "Save" }
                            onPress={handleSubmit(updateImageMeta)}
                        />                    
                        <CustomButton
                            styles={{
                                borderRadius: 0,
                                elevation: 3,
                                marginTop:0,
                                color:'black',
                                marginLeft: 10,                             
                            }}                      
                            title={ "Remove" }
                            onPress={handleSubmit(removeImage)}
                        /> 
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
                        
                        <Image source={{uri:imageState?.uri}} /* Use item to set the image source */
                            style={{
                                borderWidth:1,
                                borderColor:'#d8d8d8',
                                borderRadius:4,
                                width:'50%',
                                aspectRatio:1,
                                backgroundColor:'#d0d0d0',
                            }}
                        />             
                        <Text style={{
                            display:'none',
                            marginTop:0, 
                            fontSize: 14,
                            maxWidth:'70%',
                            color: 'black',
                            paddingLeft:20                            
                        }}>{imageState?.fileName}</Text>
                    </View>
                    <View style={{}}>
                        <Text style={s.label}>Photographer (optional)</Text>
                        
                            <AutocompleteDropdownContextProvider style={{flex:1}}>

                                <AutocompleteDropdown
                                
                                      ref={searchRef}
                                      controller={controller => {
                                        dropdownController.current = controller
                                      }}
                                      // initialValue={'1'}
                                      dataSet={suggestionsList}
                                      onChangeText={getSuggestions}
                                      onSelectItem={item => {
                                        item && setSelectedItem(item.id)
                                      }}
                                      //debounce={600}
                                      //suggestionsListMaxHeight={Dimensions.get('window').height * 0.2}
                                      onClear={onClearPress}
                                      onChevronPress= {() => dropdownController.current.toggle()}

                                      //  onSubmit={(e) => onSubmitSearch(e.nativeEvent.text)}
                                      //onOpenSuggestionsList={onOpenSuggestionsList}
                                      //loading={loading}
                                      useFilter={false} // set false to prevent rerender twice
                                      
                                      renderItem={(item, text) => <Text style={{ color: 'black', padding: 15, backgroundColor:'',  }}>{item.title}</Text>}
                                      inputHeight={50}
                                      showChevron={true}
                                      closeOnBlur={false}
                                      //showClear={true}


                                    direction={'down'}
                                    //style={styles.input}
                                    textInputProps={{
                                        placeholder: 'Type to Search',
                                        autoCorrect: false,
                                        autoCapitalize: 'none',
                                        style: {
                                            height:40,
                                            borderRadius: 4,
                                            color: 'black',
                                            paddingLeft: 0,
                                        },
                                    }}
                                    rightButtonsContainerStyle={{
                                        right: 8,
                                        height:40,
                                        alignSelf: 'center',
                                    }}
                                    inputContainerStyle={{
                                        backgroundColor:'white',
                                        borderRadius: 4,
                                        paddingLeft:10,
                                        borderWidth: 1,
                                        borderColor: 'black',
                                        borderStyle: 'solid'                                        
                                    }}
                                    suggestionsListContainerStyle={{
                                        marginLeft:-20,
                                        zIndex:9999,
                                        marginTop:30,
                                        backgroundColor:'#e8e8e8'
                                    }}
                                    suggestionsListTextStyle={{
                                    }}
                                    containerStyle={{ 
                                        flexGrow: 1, 
                                        flex:1,
                                        flexShrink: 1 ,
                                    }} 
                                />
                            </AutocompleteDropdownContextProvider>
                        
                        
                    </View>                   



                    <View style={{flex:1, flexDirection:'row', marginTop:5, marginBottom:5, zIndex:-1}}>
                        <View style={{width:'50%'}}>
                            <Text style={s.label}>Year of Photograph</Text>
                            <Controller
                                control={control}
                                render={({field: { onChange, onBlur, value=imageState?.year }}) => (
                                        <TextInput
                                            style={{
                                                backgroundColor: 'white',
                                                borderColor: 'black',
                                                borderWidth:1,
                                                height: 40,
                                                padding: 10,
                                                borderRadius: 4,        
                                                width:120                                           
                                            }}
                                            onFocus={onFocusKeyboard}
                                            onBlur={onFocusKeyboardBlur}
                                            onChangeText={value => onChange(value)}
                                            value={(value) ? value : ""}
                                        />
                                )}
                                name="year"
                            />

                        </View>
                        <View>
                            <Text style={[s.label]}>Make Primary Picture</Text>
                            
                            <Checkbox
                                style={{marginTop:8}}
                                value={isChecked}
                                onValueChange={setChecked}
                                color={isChecked ? 'black' : undefined}
                            />
                        </View>

                    </View>
                    <View style={{zIndex:-1}}>
                        <Text style={s.label}>Title</Text>
                        <Controller
                            control={control}
                            render={({field: { onChange, onBlur, value="" }}) => (
                                    <TextInput
                                        style={{
                                            backgroundColor: 'white',
                                            borderColor: 'black',
                                            borderWidth:1,
                                            height: 40,
                                            padding: 10,
                                            borderRadius: 4,        
                                            width:'100%'                                           
                                        }}
                                        onFocus={onFocusKeyboard}
                                        onBlur={onFocusKeyboardBlur}
                                        onChangeText={value => onChange(value)}
                                        value={(value) ? value : ""}
                                    />
                            )}
                            name="title"
                        />
                    </View> 
                    <View style={{/*flex:1, height:150,*/ zIndex:-1}}>
                        <Text style={s.label}>Alt Text</Text>
                        <Controller
                            control={control}
                            render={({field: { onChange, onBlur, value="" }}) => (
                                    <TextInput
                                        multiline
                                        style={{
                                            backgroundColor: 'white',
                                            borderColor: 'black',
                                            borderWidth:1,
                                            padding: 6,
                                            borderRadius: 4,        
                                            width:'100%'                                           
                                        }}
                                        onFocus={onFocusKeyboard}
                                        onBlur={onFocusKeyboardBlur}
                                        onChangeText={value => onChange(value)}
                                        value={(value) ? value : ""}
                                    />
                            )}
                            name="alttext"
                        />
                    </View>                     
                </View>
            </ScrollView>
        
            </View>
        </>
    );
}

