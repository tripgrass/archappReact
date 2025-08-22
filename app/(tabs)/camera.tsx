import { Button, ImageBackground, Platform, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import CustomButton from '@/components/Button';

import { CameraView, CameraType, useCameraPermissions } from 'expo-camera';
import Ionicons from '@expo/vector-icons/Ionicons';
import { manipulateAsync, FlipType, SaveFormat } from 'expo-image-manipulator';
import { useState } from 'react';
import {ImagesService}  from '@/utilities/ImagesService';

import _ from "lodash";

let camera: CameraView
const s = require('@/components/style');

const CameraPreview = ({photo, retakePicture, savePhoto}: any) => {
    return (
        <View
            style={{
                flex: 1,
                width: '200px',
                height: '200px'
            }}
        >
            <ImageBackground source={{uri: photo && photo.uri}} style={{flex: 1}}>
                <View
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        padding: 15,
                        justifyContent: 'flex-end'
                    }}
                >
                    <View
                        style={{
                            flexDirection: 'row',
                            justifyContent: 'space-between',
                            paddingBottom: 100
                        }}
                    >
                        <TouchableOpacity
                            onPress={retakePicture}
                            style={{
                                width: 130,
                                height: 40,

                                alignItems: 'center',
                                //borderRadius: 4
                            }}
                        >
                            <Text
                                style={{
                                    color: '#fff',
                                    fontSize: 20
                                }}
                            >
                                Re-take
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={savePhoto}
                            style={{
                                width: 130,
                                height: 40,

                                alignItems: 'center',
                                //borderRadius: 4
                            }}
                        >
                            <Text
                                style={{
                                    color: '#fff',
                                    fontSize: 20
                                }}
                            >
                                Save Photo
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}
export default function App({galleryState, stateChanger, cameraState, setCameraState, artifactId, artifact}) {
    const [startCamera, setStartCamera] = useState(false)

    const [facing, setFacing] = useState<CameraType>('back');
    const [flash, setFlash] = useState<CameraType>('o');
    const [permission, requestPermission] = useCameraPermissions();
    const [previewVisible, setPreviewVisible] = useState(false);
    const [capturedImage, setCapturedImage] = useState<any>(null);

    if (!permission) {
    // Camera permissions are still loading.
        return <View />;
    }
/*
    if (!permission.granted && cameraState ) {
        // Camera permissions are not granted yet.
        return (

            <View style={styles.container}>
                <Text style={styles.message}>We need your permission to show the camera</Text>
                <Button onPress={requestPermission} title="grant permission" />
            </View>
        );
    }
*/  
    const __startCamera = async () => {
         if (!permission) {
                // Camera permissions are still loading.
            alert('waiting');
            }

            setStartCamera(true)
            if (!permission.granted) {
                // Camera permissions are not granted yet.
//              alert('not granted');
            }    
            else{
                setStartCamera(true)
            }
    }    
    const __takePicture = async () => {
        const photo: any = await camera.takePictureAsync()
        setPreviewVisible(true)
        setCapturedImage(photo)
    }
    const __retakePicture = () => {
        setCapturedImage(null)
        setPreviewVisible(false)
        __startCamera()
    }
    const __savePhoto = async () => {

        const manipResult = await manipulateAsync(
            capturedImage.uri,
            [{ resize: { width: capturedImage.width * 0.3 } }],
            { compress: .5 }
        );  
        const cloneDeep = _.cloneDeep(galleryState);    
        cloneDeep.push(manipResult);

        //setSaveState('savingImage');
        var form = new FormData();
        form.append('artifact_id', artifactId);
        if( "undefined" == typeof artifact || !artifact ){
            form.append('temp', true);
        }
        imageMeta = {};
        form.append('imagesMeta[0]', JSON.stringify( manipResult ) );
        if( Platform.OS == "web" ){
            form.append('source', 'web');
            form.append('images[0]', manipResult );
        }
        else{
            form.append('source','phone');
            const uri =
            ( Platform.OS === "android" || Platform.OS === "web" )
                ? manipResult.uri
                : manipResult.uri.replace("file://", "");
            const filename = manipResult.uri.split("/").pop();
            console.log('adding filename:', filename);
            const match = /\.(\w+)$/.exec(filename as string);
            const ext = match?.[1];
            const type = match ? `image/${match[1]}` : `image`;
            form.append('images[0]', {
                uri,
                name: `image.${ext}`,
                type,
            } as any);

        }   
        ImagesService({
                method:'create',
                data:form
            })
            .then( result => {
                console.log('image save result',result);
               // setSaveState(null);


            }).catch((error) => {
                console.log('saving error:',error);
                //setSaveState(null);
            })                      
        stateChanger( cloneDeep );
        setCapturedImage(null)
        setPreviewVisible(false)
        setCameraState(false)
    }
    function toggleCamera() {
        setCameraState(false);
    }
    function toggleCameraFacing() {
        setFacing(current => (current === 'back' ? 'front' : 'back'));
    }
    function toggleFlash() {
        setFlash(current => (current === 'on' ? 'off' : 'on'));
    }

    return (
        <>
        { (!permission.granted && cameraState ) ?
         (

            <View style={[s.formWrapperCamera,{backgroundColor:'#484848'}]}>  
                <View style={{flex: 1,width: '100%',overflow:'hidden',borderRadius:30, justifyContent:'center', alignItems:'center', flexDirection:'column'}}>
                    <Text style={[styles.message,{color:'white', fontSize:20, maxWidth:'80%'}]}>We need your permission to use the camera</Text>
                    <CustomButton styles={{
                                        marginTop:40,
                                        elevation: 3,
                                        color:'black'
                                    }}  
                        onPress={requestPermission} title="Grant Permission" />
                </View>
            </View>
        ) : (null)
    }

        { ( cameraState && permission.granted) ? (
            <View style={[s.formWrapperCamera,{backgroundColor:'#484848'}]}>  
                <View style={{flex: 1,width: '100%',overflow:'hidden',borderRadius:30}}>

                                {previewVisible && capturedImage ? (
                                    <View style={{height:'100%', width:'100%', background:'red'}}>
                                        <CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} />
                                    </View>
                                ) : (

      <CameraView
                    facing={facing}
                    enableTorch="true"
                    flashMode="on"
                    flash={flash}
                    style={{
                      flex: 1, 
                      width:'100%', 
                      position:'absolute', 
                      bottom:0,
                      top:0,

                    }}
                    ref={(r) => {
    camera = r
    }}
                    
                  >
                    <View
                      style={{
                        flex: 1,
                        //backgroundColor: 'transparent',
                        flexDirection: 'row'
                      }}
                    >
                      <View
                        style={{
                          position: 'absolute',
                          left: '8%',
                          top: '6%',
                          right:'8%',
                          flexDirection: 'row',
                          justifyContent: 'space-between'
                        }}
                      >
                        <TouchableOpacity
                          onPress={toggleCamera}
                          style={{
                            height: 50,
                            width: 50
                          }}
                        >
                          <Ionicons name="close-outline" size={50} color="white" style={{
                            display:'flex-inline',
                            height:50,
                            width:50,
                          }}/>
                        </TouchableOpacity>
                        <TouchableOpacity
                          onPress={toggleFlash}
                          style={{
                            height: 50,
                            width: 50
                          }}
                        >
                          <Ionicons name={flash === 'on' ? 'flash-outline' : 'flash-off-outline'}
                           size={50} color="white" style={{
                            display:'flex-inline',
                            height:50,
                            width:50,
                          }}/>
                        </TouchableOpacity>                       
                        <TouchableOpacity
                          onPress={toggleCameraFacing}
                          style={{
                            height: 50,
                            width: 50
                          }}
                        >
                          <Ionicons name="camera-reverse-outline" size={50} color="white" style={{
                            display:'flex-inline',
                            height:50,
                            width:50,
                          }}/>
                        </TouchableOpacity>
                      </View>
                      <View
                        style={{
                          position: 'absolute',
                          bottom: 0,
                          flexDirection: 'row',
                          flex: 1,
                          width: '100%',
                          padding: 20,
                          justifyContent: 'space-between'
                        }}
                      >
                        <View
                          style={{
                            alignSelf: 'center',
                            flex: 1,
                            alignItems: 'center'
                          }}
                        >
                          <View
                            style={{    
                            alignItems: 'center',
                          justifyContent: 'center',
                              width: 78,
                              height: 78,
                              bottom: 30,
                              borderRadius: 50,
                              backgroundColor: 'white'
                            }}
                          >
                          <TouchableOpacity
                            onPress={__takePicture}
                            style={{
                              width: 70,
                              height: 70,
                              borderWidth:5,
                              border:'10px solid rgba(0, 0, 0, 0.05)',
                              borderRadius: 50,
                              backgroundColor: 'white'
                            }}
                          />
                          </View>
                        </View>
                      </View>
                    </View>
                  </CameraView>
                  )}
                            </View>
                    </View>     
    
                        ) : (
                            <></>
                        )}
                        </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  message: {
    textAlign: 'center',
    paddingBottom: 10,
  },
  camera: {
    flex: 1,
    background:'red',
    height:'100%'
  },
  buttonContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: 'blue',
    margin: 64,
  },
  button: {
    flex: 1,
    alignSelf: 'flex-end',
    alignItems: 'center',
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
  },
});
