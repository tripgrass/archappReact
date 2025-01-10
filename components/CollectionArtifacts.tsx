import { Button, Dimensions, FlatList, Image, Keyboard, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, SafeAreaView } from 'react-native';
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
export default function App({ suggestionsList, setSuggestionsList, initCollectionId, artifactsList, slideoutState, setslideoutState, artifacts, setArtifacts}) {
    const [defaultValues, setDefaultValues] = useState({});
    const { register, setError, getValues, setValue, getValue, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues:defaultValues
    }); 
    const [keyboardHeight, setKeyboardHeight] = useState(0);    
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);  
    const isFocused = useIsFocused()
    const [isLoaded, setIsLoaded] = useState(false);
    const [loading, setLoading] = useState(false)
    const notificationBarHeight = 50;
    const [isPrimary, setIsPrimary] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [selectedItemTitle, setSelectedItemTitle] = useState(null);
    //const [suggestionsList, setSuggestionsList] = useState( [] )

    const searchRef = useRef(null);

    const formFields = {
        year : null,
        person_id:null,
        person_type : null,
        isPrimary: null,
        title: null,
        alttext:null
    };    

    useEffect(() => {
        // hides development popup warning for autocompletedropdown in scrollview
        LogBox.ignoreLogs(['VirtualizedLists should never be nested']);

        //console.log('defaultValues', defaultValues);
        //console.log('defaultValues.lenngth', Object.keys(defaultValues).length);
        if( Object.keys(defaultValues).length < 1 && !isLoaded){
            
        }

        // setup keyboard handling
        const showSubscription = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
        const hideSubscription = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

        return () => {
            showSubscription.remove();
        };
    })

    const addArtifact = item =>{
        const cloneDeepSuggestions = _.cloneDeep( suggestionsList );
        const cloneDeepArtifacts = _.cloneDeep( artifacts );        
        Object.keys( cloneDeepSuggestions ).forEach((k, i) => {
            if( "undefined" != typeof cloneDeepSuggestions[k] && "undefined" != typeof item ){
                if( cloneDeepSuggestions[k].id == item.id ){
                    cloneDeepSuggestions.splice(k, 1);
                    setSuggestionsList( cloneDeepSuggestions );
                    cloneDeepArtifacts.push( item );
                    setArtifacts( cloneDeepArtifacts );
                }
            }
        });
                  
    }

    const removeArtifact = item => {
        const cloneDeepSuggestions = _.cloneDeep( suggestionsList );
        const cloneDeepArtifacts = _.cloneDeep( artifacts );
        
        Object.keys( cloneDeepArtifacts ).forEach((k, i) => {
            if( "undefined" != typeof cloneDeepArtifacts[k] && "undefined" != typeof item ){
                if( cloneDeepArtifacts[k].id == item.id ){
                    cloneDeepArtifacts.splice(k, 1);
                    setArtifacts( cloneDeepArtifacts );
                }
            }
        });
        Object.keys( artifactsList ).forEach((k, i) => {
            if( artifactsList[k].id == item.id ){
                cloneDeepSuggestions.push(item);
            }
        })
        setSuggestionsList( cloneDeepSuggestions );
    }    
    const handleKeyboardShow = event => {
        console.log('handlekey show');
       // setIsKeyboardVisible(true);
        setKeyboardHeight(event.endCoordinates.height);
    };
    const onFocusKeyboard = event => {
          setIsKeyboardVisible(true);            
    }
    const onFocusKeyboardBlur = event => {
        //    setIsKeyboardVisible(false);            
    }
    const handleKeyboardHide = event => {
        //setKeyboardHeight(0);
        setIsKeyboardVisible(false);
    }; 
      const dropdownController = useRef(null)

    const getSuggestions = useCallback(async q => {
    
    const filterToken = q.toLowerCase();
    if (typeof q !== 'string' || q.length < 2) {
      setSuggestionsList(suggestionsList)
      return
    }
//    setLoading(true)
    const suggestions = 
        artifactsList.filter(item => item.title.toLowerCase().includes(filterToken))
            .map(item => ({
                id: item.id,
                title: item.title,
            }))
            setSuggestionsList(suggestions)
        }, [])

const onClearPress = useCallback(() => {
    //setSuggestionsList(artifacts)
  }, [])
 const onChevronPress = useCallback(() => {
    console.log('chevron!!!!!!!!!!!!!!! suggestionsList', suggestionsList.length);

    dropdownController.current.toggle();
 }, [])

  
    

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
                    voidstyle={[
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
                        paddingBottom:150,
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
                                backgroundColor: 'white',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 20,
                                height:40,
                                marginTop:10,
                                width:40,
                                elevation: 3,
                                marginRight:5,
                                boxShadow: '0px 2px 2px #d8d8d8'    
                            }}
                        >
                            <Ionicons name="arrow-back-outline" size={30} color="black" style={{
                                display:'flex-inline',
                                            height:30,
                                            width:30,
                                            borderRadius:16,    
                            }}/>
                        </TouchableOpacity>  
                        <CustomButton
                            styles={{
                                borderRadius: 20,
                                elevation: 3,
                                color:'black',
                                marginLeft: 'auto',                             
                            }}                      
                            title={ "Save" }
                        />                                                                      
                </View>                
                <View style={ { minHeight:300, backgroundColor:'', zIndex:99999999999}} >

                             
                    <View style={{}}>

                        <AutocompleteDropdownContextProvider style={{ }}>
                            <AutocompleteDropdown
                              ref={searchRef}
                              controller={controller => {
                                dropdownController.current = controller
                              }}
//                                      initialValue={imageState?.person_id ? imageState?.person_id : 1}
                                dataSet={suggestionsList}
                                onChangeText={getSuggestions}
                                onSelectItem={item => {
                                    item && addArtifact(item)
                                }}
//                                      loading={loading}
                                      //debounce={600}
                                //suggestionsListMaxHeight={Dimensions.get('window').height * 0.2}
                                suggestionsListMaxHeight={150}
                                onClear={onClearPress}
                                onChevronPress= {onChevronPress}
                                      //  onSubmit={(e) => onSubmitSearch(e.nativeEvent.text)}
                                      //onOpenSuggestionsList={onOpenSuggestionsList}
//                                      loading={loading}
                                      //useFilter={false} // set false to prevent rerender twice      
                                renderItem={(item, text) => 
                                ( <Text style={{ color: 'black', padding: 15, backgroundColor:'',  }}>{item.name}-{item.address}-({item.id})</Text> ) }
                                inputHeight={50}
                                showChevron={true}
                                closeOnBlur={true}
                                showClear={true}
                                direction={'down'}
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
                               containerStyle={{ flexGrow: 1, flexShrink: 1 , flex:1}}
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
                                    zIndex:9999999,
                                    marginTop:0,
                                    backgroundColor:'white',
                                }}
                                suggestionsListTextStyle={{
                                }}
                            />
                        </AutocompleteDropdownContextProvider>
                    </View>
                    <View style={ { backgroundColor:'', flex:1, zIndex:-1}} >
                    
                    <View style={{ display:'block',flex:1,zIndex:-1, backgroundColor:'', marginTop:10}}>
                    {Object.keys(artifacts).map((i, item) => (
                        <View key={i} style={{ backgroundColor:'', maxWidth:'1200px', margin:'0 auto', display:'flex', flexWrap:'wrap',flexDirection:'row',width:'100%', alignItems:'center', marginTop:8}}>
                            <Text style={[ {width:'30%',flexGrow: 1}]}>{artifacts[i].name}-{artifacts[i].id}</Text>
                            <CustomButton
                                webbable={true}
                                styles={{marginRight:5, paddingHorizontal: 14 }}
                                title="Remove"
                                onPress={ () => { removeArtifact( {id: artifacts[i].id,  name:artifacts[i].name} ) }}
                            />                            
                        </View>

                    ))}
                    </View>                            
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

