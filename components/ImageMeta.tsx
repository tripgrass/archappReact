import { Button, Dimensions, Image, Keyboard, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Checkbox from 'expo-checkbox';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useEffect, useState } from 'react';
import CustomButton from '@/components/Button';

import { useForm, Controller } from 'react-hook-form';

const s = require('@/components/style');
export default function App({ artifactId, slideoutState, setslideoutState, imageState, setImageState }) {
    //console.log('slideoutState',slideoutState);
    //console.log('imageState', imageState);
    let defaultValues = {};
    const { register, setError, getValues, setValue, getValue, handleSubmit, control, reset, formState: { errors } } = useForm({
        defaultValues:defaultValues
    }); 
    const [keyboardHeight, setKeyboardHeight] = useState(0);    
    const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);   
useEffect(() => {
    if( imageState ){
//        console.log('has Image state!');
        defaultValues.name = imageState?.name;
        defaultValues.year = "2025";
        if( imageState?.year || !imageState.year ){
        }
    }
    reset({ ...defaultValues });
  }, []);    
  //  console.log( getValues() );

    const [isChecked, setChecked] = useState(false);
 useEffect(() => {
        const showSubscription = Keyboard.addListener('keyboardDidShow', handleKeyboardShow);
        const hideSubscription = Keyboard.addListener('keyboardDidHide', handleKeyboardHide);

        return () => {
            showSubscription.remove();
        };
    }, []);

    const handleKeyboardShow = event => {
        setIsKeyboardVisible(true);
        console.log('handle setIsKeyboardVisible', isKeyboardVisible);
        setKeyboardHeight(event.endCoordinates.height);
    };

    const handleKeyboardHide = event => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
    }; 
    const updateImageMeta = data => {
        var form = new FormData();
        console.log('updateImage Data', data);
        console.log('updateImage imageState', imageState);
        console.log('artifactid ', artifactId);
        form.append('artifact_id', (artifactId ? artifactId : null));
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
            ArtifactsService({
                method:'create',
                url:'artifacts',
                data:form
            }).then( (results) => {
                // route to edit?
        }).catch(console.log('.error'))                 
        */
    };    
function clearYear() {

}
function setHeight(){
    var screenHeight = Dimensions.get("window").height;
        var newHeight = screenHeight - 87 - keyboardHeight;
        //alert(newHeight);
        return newHeight;
}
function toggleSlideout() {

    setslideoutState(  "out" == slideoutState ? "in" : 'out' );
           // setValue('year', "2024");
            console.log("getValues('root.year')");
            console.log(getValues('root'));

}
    return (
        <>
       <ScrollView 
                style={[ 
                    ('out' == slideoutState) ? styles.mainWrapperOut : styles.mainWrapper,
('out' == slideoutState) ? (  isKeyboardVisible  ? {backgroundColor:'', height:setHeight()} : {backgroundColor:'', height:'auto'} ) : {backgroundColor:''}                    
                 ]} 

                contentContainerStyle={ [ ('out' == slideoutState) ? styles.wrapperOut : styles.wrapper ,
('out' == slideoutState) ? (  isKeyboardVisible  ? {backgroundColor:''} : {backgroundColor:''} ) : {backgroundColor:'white'}                    

                    
                    ]}
            > 
                
                <View style={ {height:'auto'}} >
                    <View style={{flex:1, flexDirection:'row'}}>
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
                        <Image source={{uri:imageState?.uri}} /* Use item to set the image source */
                            style={{
                                width:50,
                                height:50,
                                backgroundColor:'#d0d0d0',
                            }}
                        />             
                        <Text style={styles.text}>{imageState?.fileName}</Text>
                    </View>
                    <View style={{flex:1, flexDirection:'row', marginTop:5, marginBottom:5}}>
                        <Text style={s.label}>Make Primary Picture for Artifact</Text>
                        
                        <Checkbox
                            style={{marginTop:5, marginLeft:8}}
                            value={isChecked}
                            onValueChange={setChecked}
                            color={isChecked ? '#4630EB' : undefined}
                        />
                    </View>                                                             
                     
                    <View style={{}}>
                        <Text style={s.label}>Year of Photograph</Text>
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
                                            width:100                                           
                                        }}
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        value={(value) ? value : ""}
                                    />
                            )}
                            name="year"
                        />

                    </View>
                    <View style={{}}>
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
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        value={(value) ? value : "none"}
                                    />
                            )}
                            name="title"
                        />
                    </View> 
                    <View >
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
                                        onBlur={onBlur}
                                        onChangeText={value => onChange(value)}
                                        value={(value) ? value : ""}
                                    />
                            )}
                            name="alttext"
                        />
                    </View>                     
                    <View style={{}}>
                        <Text style={s.label}>Photographer (optional)</Text>
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
                                    onBlur={onBlur}
                                    onChangeText={value => onChange(value)}
                                    value={(value) ? value : ""}
                                />
                            )}
                            name="photographer"
                        />
                    </View> 
                    <View style={{flex:1, flexDirection:'row'}}>
                        <CustomButton
                            styles={{
                                borderRadius: 0,
                                elevation: 3,
                                marginTop:45,

                                color:'black',
                                marginRight: 'auto',                             
                            }}                      
                            title={ "Save" }
                            onPress={handleSubmit(updateImageMeta)}
                        />                    
                        <CustomButton
                            styles={{
                                borderRadius: 0,
                                elevation: 3,
                                marginTop:45,
                                color:'black',
                                marginLeft: 'auto',                             
                            }}                      
                            title={ "Remove" }
                            onPress={ () => { removeImage() }}
                        />                                            
                    </View>

                </View>
                
            </ScrollView>
        </>
    );
}

const styles = StyleSheet.create({
    mainWrapper:{
        color:'white',
        elevation:5,
        height:0,
        position:'absolute'
    },
    mainWrapperOut:{
        color:'white',
        top:130,
        width:'92%',
        elevation:4,
        right:0,
        position:'absolute',

    },    
    wrapper:{
        marginTop:0,
    },
    wrapperOut:{
        marginTop:0,
        elevation: 4,  
        height:'auto',  
        backgroundColor:'white',
        transition: '3s',        
        justifyContent: 'right',
        flex:1,
        top:0,
        right: 0, 
        width: '100%',
        padding:20,
//        minHeight:300,  
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
});
