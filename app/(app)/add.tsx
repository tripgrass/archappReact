//https://www.freecodecamp.org/news/how-to-create-a-camera-app-with-expo-and-react-native/
import {StatusBar} from 'expo-status-bar'
import React, { useState } from 'react'
import axios from 'axios';
import querystring from 'querystring';

import {StyleSheet, Text, View, TouchableOpacity, Alert, ImageBackground, Image} from 'react-native'
import {CameraView, CameraType, useCameraPermissions} from 'expo-camera'
//import MediaLibrary from '../../components/MediaLibrary'; 
import * as MediaLibrary from 'expo-media-library';
import { useSession } from '../../ctx';

let camera: CameraView

export default function App() {
  const [startCamera, setStartCamera] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [capturedImage, setCapturedImage] = useState<any>(null)
  const [cameraType, setCameraType] = useState()
  const [flashMode, setFlashMode] = useState('off')

  const [facing, setFacing] = useState<CameraType>('back');
  const [permission, requestPermission] = useCameraPermissions();
  const { session, isLoading } = useSession();


  const __startCamera = async () => {
     if (!permission) {
        // Camera permissions are still loading.
      alert('waiting');
      }

      if (!permission.granted) {
        // Camera permissions are not granted yet.
        alert('not granted');
      }    
      else{
        setStartCamera(true)
      }
  }

  const postArt = async () => {
    const formdata = new FormData();
    formdata.append("name", "rando");

    const requestOptions = {
      headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Authorization": "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiMjJhZDRhNGIwODA0ZDkwMTM4MzY1NzljNGQxYWFlNWI1ODc2YjYzNWY3YjdiYTJkMzI3MTUwZGRhOTAxZWQ4YjdmMDM2NTc3MDJiNmI2M2QiLCJpYXQiOjE3MjkwNDczNjUuMDgwNzY4LCJuYmYiOjE3MjkwNDczNjUuMDgwNzcsImV4cCI6MTc2MDU4MzM2NS4wNzYyMiwic3ViIjoiIiwic2NvcGVzIjpbIioiXX0.q-FYTDDONhdz0NrGHBheUJqRmIxv6mlUtDOjfO2Wqi-reupe_fTaQujRkApYM_XvcyA8cN5x1qiucu-DzKbDN0PwzgLPuuQxt5L0qRQ2mWRx7rk_C0bT18nXQgwARljS2gIxihIjJGQAeoajwxm4Mhl7ziZ6tOjpVmokOEgWyGTPfqAd1mxIIfS2hhZuTU2F3T-J0ujqLjdUK1xX6bM_Vt_NYnfWkc-tCE5am1DmDiO33l63iQ6N8aUrfHhkQBLCiAtmMCw0h9EsD_d8L-37kPL7vDDoOUPPaE-NeZ4NpAQc_qpmfHIuOiAG7HX7KTWVqoapu9awue2SvaxZHQo9prkoCqN7uwxGXeSDBo2KXioIhP38Q_UKNaaih42Bw04WcJveSeIt8nAxHoA6Plyim9-BL2MY1Rq2ARS5PiLlEz1lSBrJeRzB-Tf8CaSBVuTCaA19mvGwLaOV4BC1YlCRwAaC_ASjrJrkU2xFwFi2tcu9-57GfJI9kVQhSS4Gja4_MkZ-LCVVaSYU0s08e-sFBoKJI6OtZKHAhruC8-nfu4UX3Q3-26KTMiKOlfw7ETwHYA2oCRyjYPre8DS-StH9chqdyb4Zml-V6SLBasrWlmWb-8fJOsFxWRHsRD4lD6TcAN98I_uWgTUZjOOZ5BjtCBYTIpA4CxEtyQCfP0g2By0",
      },
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

let config = {
  method: 'post',
  maxBodyLength: Infinity,
  url: 'https://zkd.b51.mytemp.website/api/artifacts?name=what',
  headers: { 
    'Accept': 'application/json', 
    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJhdWQiOiIzIiwianRpIjoiMjJhZDRhNGIwODA0ZDkwMTM4MzY1NzljNGQxYWFlNWI1ODc2YjYzNWY3YjdiYTJkMzI3MTUwZGRhOTAxZWQ4YjdmMDM2NTc3MDJiNmI2M2QiLCJpYXQiOjE3MjkwNDczNjUuMDgwNzY4LCJuYmYiOjE3MjkwNDczNjUuMDgwNzcsImV4cCI6MTc2MDU4MzM2NS4wNzYyMiwic3ViIjoiIiwic2NvcGVzIjpbIioiXX0.q-FYTDDONhdz0NrGHBheUJqRmIxv6mlUtDOjfO2Wqi-reupe_fTaQujRkApYM_XvcyA8cN5x1qiucu-DzKbDN0PwzgLPuuQxt5L0qRQ2mWRx7rk_C0bT18nXQgwARljS2gIxihIjJGQAeoajwxm4Mhl7ziZ6tOjpVmokOEgWyGTPfqAd1mxIIfS2hhZuTU2F3T-J0ujqLjdUK1xX6bM_Vt_NYnfWkc-tCE5am1DmDiO33l63iQ6N8aUrfHhkQBLCiAtmMCw0h9EsD_d8L-37kPL7vDDoOUPPaE-NeZ4NpAQc_qpmfHIuOiAG7HX7KTWVqoapu9awue2SvaxZHQo9prkoCqN7uwxGXeSDBo2KXioIhP38Q_UKNaaih42Bw04WcJveSeIt8nAxHoA6Plyim9-BL2MY1Rq2ARS5PiLlEz1lSBrJeRzB-Tf8CaSBVuTCaA19mvGwLaOV4BC1YlCRwAaC_ASjrJrkU2xFwFi2tcu9-57GfJI9kVQhSS4Gja4_MkZ-LCVVaSYU0s08e-sFBoKJI6OtZKHAhruC8-nfu4UX3Q3-26KTMiKOlfw7ETwHYA2oCRyjYPre8DS-StH9chqdyb4Zml-V6SLBasrWlmWb-8fJOsFxWRHsRD4lD6TcAN98I_uWgTUZjOOZ5BjtCBYTIpA4CxEtyQCfP0g2By0', 
    'Cookie': 'XSRF-TOKEN=eyJpdiI6IjdlbXRyTHFmVS9udFNpUTRaTENCUnc9PSIsInZhbHVlIjoiQndGNk1hYlBYZUk0Y1ZYOWxLZ3B5T2dqaG1heW9pS2txYzJybzBjelR2RXRRYjQyYmlMZlVEcnU1VDE2bVROb3BlVUd2b3J3SVpTZmNVb24xYktYZitnSUo3bGorQTFhdm1SSFJ2d1d3N1hGQmx6all4WVJJbTRUY29UVFlaS2IiLCJtYWMiOiI1ZjUwNzNlMmJmODU2MDNiNzE4MzU0ZjdkYjljZWFiNGJiOGNmNTgzODMwM2IzOGI0MGEyZDFmY2JiZmE0MWIyIiwidGFnIjoiIn0%3D; laravel_session=eyJpdiI6ImFmcG5Jc0JRT2NvTjZPRTIrci9yWlE9PSIsInZhbHVlIjoiZGRBTURBRVlsenB5d3RPb3d0Q1Bna1c3WHZKdG9ZbzMvTkZHb0dwTWQ2akFCOEZQWkZXejdFRUk1T2VNQjRFR2NjRFY0OWFxSTBlYitXck5UVThpcm5UNjBpMGN0UmJIMEtTOEZBNGw0R1UxMkVlbzl1cmlXMy9TNXFOLzdvNzIiLCJtYWMiOiI3ZjBlOWU2ZDU3ZTQwZmViMjQ1OGI5YjJmY2FlMDg5N2NmZTQ5MGEyNGMzNmRiZjkwNWMyOWJhYjU4MDE3M2RlIiwidGFnIjoiIn0%3D'
  }
};

axios.request(config)
.then((response) => {
  console.log(JSON.stringify(response.data));
})
.catch((error) => {
  console.log(error);
});

//    const response = await fetch("https://zkd.b51.mytemp.website/artifacts", requestOptions);
    /*
      const response = await axios
          .post("https://zkd.b51.mytemp.website/api/artifacts", {
            body: formdata,
            headers: {
              'Accept': "application/json",
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session}`
            }
          })
          .then((response) => {
            console.log('respose--->', response);
          })
          .catch((error) => console.log(error))
      */
  //  const data = await response.json();
    //console.log('data',data);
    //return data;
  }
  const __takePicture = async () => {
    const photo: any = await camera.takePictureAsync()
    console.log(photo)
    setPreviewVisible(true)
    setCapturedImage(photo)
  }


  const __saveArtifact = () => {
    alert(1);
    postArt();
  }
  const __savePhoto = () => {
console.log(capturedImage);
    setCapturedImage(null)
    setPreviewVisible(false)
    setStartCamera(false)
    MediaLibrary.saveToLibraryAsync(capturedImage.uri);    
// now need to share image to api
  }
  const __retakePicture = () => {
    setCapturedImage(null)
    setPreviewVisible(false)
    __startCamera()
  }
  const __handleFlashMode = () => {
    if (flashMode === 'on') {
      setFlashMode('off')
    } else if (flashMode === 'off') {
      setFlashMode('on')
    } else {
      setFlashMode('auto')
    }
  }
  const __switchCamera = () => {
    if (cameraType === 'back') {
      setCameraType('front')
    } else {
      setCameraType('back')
    }
  }
  return (
    <View style={styles.container}>
      {startCamera ? (
        <View
          style={{
            flex: 1,
            width: '100%'
          }}
        >
          {previewVisible && capturedImage ? (
            <CameraPreview photo={capturedImage} savePhoto={__savePhoto} retakePicture={__retakePicture} />
          ) : (
            <CameraView
              type={cameraType}
              flashMode={flashMode}
              style={{flex: 1}}
              ref={(r) => {
                camera = r
              }}
            >
              <View
                style={{
                  flex: 1,
                  width: '100%',
                  backgroundColor: 'transparent',
                  flexDirection: 'row'
                }}
              >
                <View
                  style={{
                    position: 'absolute',
                    left: '5%',
                    top: '10%',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <TouchableOpacity
                    onPress={__handleFlashMode}
                    style={{
                      backgroundColor: flashMode === 'off' ? '#000' : '#fff',
                      //borderRadius: '50%',
                      height: 25,
                      width: 25
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20
                      }}
                    >
                      ⚡️
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={__switchCamera}
                    style={{
                      marginTop: 20,
                     // borderRadius: '50%',
                      height: 25,
                      width: 25
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 20
                      }}
                    >
                      {cameraType === 'front' ? '🤳' : '📷'}
                    </Text>
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
                    <TouchableOpacity
                      onPress={__takePicture}
                      style={{
                        width: 70,
                        height: 70,
                        bottom: 0,
                        //borderRadius: 50,
                        backgroundColor: '#fff'
                      }}
                    />
                  </View>
                </View>
              </View>
            </CameraView>
          )}
        </View>
      ) : (
        <View
          style={{
            flex: 1,
            backgroundColor: '#fff',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        >
          <TouchableOpacity
            onPress={__startCamera}
            style={{
              width: 130,
              //borderRadius: 4,
              backgroundColor: '#14274e',
              flexDirection: 'row',
              justifyContent: 'center',
              alignItems: 'center',
              height: 40
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              Take picture
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={__saveArtifact}
            style={{
              width: 130,
              //borderRadius: 4,
              backgroundColor: '#14274e',
              flexDirection: 'row',
              marginTop: 20,
              justifyContent: 'center',
              alignItems: 'center',
              height: 40
            }}
          >
            <Text
              style={{
                color: '#fff',
                fontWeight: 'bold',
                textAlign: 'center'
              }}
            >
              Save Artifact
            </Text>
          </TouchableOpacity>          
        </View>
      )}

      <StatusBar style="auto" />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center'
  }
})

const CameraPreview = ({photo, retakePicture, savePhoto}: any) => {
  console.log('sdsfds', photo)
  return (
    <View
      style={{
        backgroundColor: 'transparent',
        flex: 1,
        width: '100%',
        height: '100%'
      }}
    >
      <ImageBackground
        source={{uri: photo && photo.uri}}
        style={{
          flex: 1
        }}
      >
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
              justifyContent: 'space-between'
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
                save photo
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </View>
  )
}