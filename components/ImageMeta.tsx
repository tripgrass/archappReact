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
export default function App({ artifactId, artifactPrimaryImageId, galleryState, galleryStateChanger, slideoutState, setslideoutState, imageState, setImageState, photographers }) {
    const [defaultValues, setDefaultValues] = useState({});
    const { register, setError, getValues, setValue, getValue, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues:defaultValues
    }); 
    const [currentImageId, setCurrentImageId] = useState( ( imageState?.id ? imageState.id : null ));    
    const [keyboardHeight, setKeyboardHeight] = useState(0);    
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);  
    const isFocused = useIsFocused()
    const [isLoaded, setIsLoaded] = useState(false);
    const [loading, setLoading] = useState(false)
    const [suggestionsList, setSuggestionsList] = useState(photographers ? photographers : null)
    const notificationBarHeight = 50;
    const [isPrimary, setIsPrimary] = useState( (artifactPrimaryImageId == imageState?.id ) ? true : false );
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemTitle, setSelectedItemTitle] = useState(null);
const formFields = {
        year : null,
        person_id:null,
        person_type : null,
        isPrimary: null,
        title: null,
        alttext:null
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
        if( imageState?.id  ){
            if( imageState.id == currentImageId ){
                console.log('USE EFFECT :::>>>>>>>>>>>>>>>>>>>>> IMAGEsTATE', imageState);
                setCurrentImageId( imageState.id );
                //setValue('year', imageState?.year ? imageState?.year : null );
                //setValue('title', imageState?.title ? imageState?.title : null );
            }
            if( artifactPrimaryImageId && artifactPrimaryImageId == imageState.id ){
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
        console.log('o!!!!!11n save selecteditem', selectedItem);

        form.append('year',data.year);
        imageState.year = data.year;
        if( selectedItem ){
            form.append('person_id', selectedItem);
            imageState.person_id = selectedItem;
        }
        form.append('person_type', "photographer");
        imageState.person_type = "photographer";
        form.append('isPrimary', isPrimary);
        imageState.isPrimary = isPrimary;
        console.log('isPrimary', isPrimary);
        form.append('title', data.title);
        imageState.title = data.title;
        form.append('alttext', data.alttext);
        imageState.alttext = data.alttext;
        form.append('artifact_id', artifactId);
        if( imageState?.id ){
            // you're editing an existing db image 
            form.append('id',imageState.id);
        }
        else{

        }
        console.log( 'imageState for counter check' , imageState );
        Object.keys(galleryState).forEach((k, i) => {
            if( imageState.counter && imageState.counter == galleryState[k].counter ){
                if( imageState ){
                    console.log('add to galleryState 175', imageState);
                    galleryState[k] = imageState;
                }
            }
        });        
        /*
        if( userSession ){
            var parsedUserSession = JSON.parse(userSession);
            form.append('user_name', parsedUserSession?.user?.name );
            form.append('user_email', parsedUserSession?.user?.email );
        }
                        
        */
        if( imageState.id ){
            ImagesService({
                method:'create',
                id:imageState.id,
                data:form
            })
            .then( result => {
                console.log(result);

            }).catch((error) => {
                console.log('saving error:',error);
            })  
        }
        toggleSlideout();
                

    };    
    const removeImage = data => {
        var form = new FormData();
        form.append('artifact_id', (artifactId ? artifactId : null));
        toggleSlideout();                    
        if( imageState?.id ){
            // you're editing an existing db image 
            form.append('id',imageState.id);
            ImagesService({
                method:'delete',
                artifact_id:artifactId,
                id:imageState?.id
            })
            .then( result => {
                console.log(result);
                const cloneDeep = _.cloneDeep(galleryState);
                Object.keys(cloneDeep).forEach((k, i) => {
                    if( imageState?.id  == cloneDeep[k].id ){
                        cloneDeep.splice(k);
                    }
                });  
                console.log('remove image clonedeep update:', cloneDeep);          
                galleryStateChanger( cloneDeep );                    
            }).catch((error) => {
                console.log('removeImage  error:',error);
            })              
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

                        <CustomButton
                            styles={{
                                borderRadius: 0,
                                elevation: 3,
                                marginTop:0,
                                color:'black',
                            }}                      
                            title={ "Remove" }
                            onPress={handleSubmit(removeImage)}
                        /> 
                        <CustomButton
                            styles={{
                                borderRadius: 0,
                                elevation: 3,
                                color:'black',
                                marginTop:0,
                                marginLeft: 10,                             
                            }}                      
                            title={ "Save" }
                            onPress={handleSubmit(updateImageMeta)}
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
//                            display:'none',
                            marginTop:0, 
                            fontSize: 14,
                            maxWidth:'70%',
                            color: 'black',
                            paddingLeft:20                            
                        }}>{imageState?.id}</Text>
                    </View>
                                       



                    <View style={{flex:1, flexDirection:'row', marginTop:5, marginBottom:5, zIndex:-1}}>

                        <View style={{width:'50%'}}>
                            <Text style={s.label}>Year of Photograph</Text>
                            <Controller
                                control={control}
                                name="year"
                                render={({field: { onChange, onBlur, value}}) => (
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
                            />

                        </View>
                        <View>
                            <Text style={[s.label]}>Make Primary Picture</Text>
        <Checkbox
            name="primary"        
                                                 style={{marginTop:8}}
                                        value={isPrimary}
                                        onValueChange={setIsPrimary}
                                        color={isPrimary ? 'black' : undefined}
             />
                        </View>

                    </View>
                    <View style={{}}>
                        <Text style={s.label}>Photographer (optional)</Text>
                        
                            <AutocompleteDropdownContextProvider style={{flex:1}}>

                                <AutocompleteDropdown
                                
                                      ref={searchRef}
                                      controller={controller => {
                                        dropdownController.current = controller
                                      }}
//                                      initialValue={imageState?.person_id ? imageState?.person_id : 1}
initialValue={{ id: (imageState?.person_id ? imageState?.person_id : null), title: ( selectedItemTitle ? selectedItemTitle : 'olding') }}
                                        dataSet={suggestionsList}
                                      onChangeText={getSuggestions}
                                      onSelectItem={item => {
                                        item && setSelectedItem(item.id)
                                      }}
                                      loading={loading}
                                      //debounce={600}
                                      //suggestionsListMaxHeight={Dimensions.get('window').height * 0.2}
                                      onClear={onClearPress}
                                      onChevronPress= {() => dropdownController.current.toggle()}

                                      //  onSubmit={(e) => onSubmitSearch(e.nativeEvent.text)}
                                      //onOpenSuggestionsList={onOpenSuggestionsList}
//                                      loading={loading}
                                      //useFilter={false} // set false to prevent rerender twice
                                      
                                      renderItem={(item, text) => <Text style={{ color: 'black', padding: 15, backgroundColor:'',  }}>{item.title}</Text>}
                                      inputHeight={50}
                                      showChevron={true}
                                      closeOnBlur={false}
                                      showClear={true}


                                    direction={'up'}
                                    //style={styles.input}
                                    textInputProps={{
                                        placeholder:  'Type to Search',
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

