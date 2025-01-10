import React, { useState, useEffect, useRef } from 'react';
import { Alert, TouchableOpacity, View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import { useSession } from '@/utilities/AuthContext';
//import MapView from '../../components/map'; 
import MapView, { Callout, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import { useNavigation } from 'expo-router';
const API_URL = 'https://zkd.b51.mytemp.website/api/artifacts';
import * as Location from "expo-location";
import MapViewDirections from 'react-native-maps-directions';

const App = () => {

  const { machineSession, isLoading } = useSession();

  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

//  const [errorMsg, setErrorMsg] = useState(null);
const mapRef = useRef<any>(null);    
 const [currentLocation, setCurrentLocation] = useState(null);
const [initialRegion, setInitialRegion] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY;

  useEffect(() => {
    (async () => {
      // permissions check
let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        // do something when permission is denied
        return;
      }

      const location = await Location.getCurrentPositionAsync();
      setUserLocation(location);
    })()
  }, [])

  useEffect(() => {
    console.log('effect');
    fetchData();

    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permission to access location was denied");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setCurrentLocation(location.coords);

      setInitialRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    };

    getLocation();
  }, []);

  const fetchData = async () => {
    /*
    try {
      const response = await axios.get(API_URL);
      console.log(response);
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    */
    const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN;
    try {
      let config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'https://zkd.b51.mytemp.website/api/artifactstest',
        headers: { 
          'Accept': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`         
        }
      };
      axios.request(config)
        .then( (result) => {
          console.log('result',result.data);
          if( 'undefined' != typeof result.data ){
      setData(result.data.data);
      setMarkers(result.data.data);
            //setMachineSession("stuff");
          }
        })
        .catch((error) => {
          console.log('error', error);
          if( '401' == error.status ){
            //setError('email', { type: 'custom', message: 'Password and Email do not match.' });
              console.log('401');
          }
        })
    } catch (error) {
      console.error("Error:", error);
    }           
  };  
/*
  const fetchData = async () => {
    try {
      
//      const response = await axios.get(API_URL);
      const response = await axios
          .get(API_URL, {
            headers: {
              Authorization: `Bearer ${machineSession}`,
            },
          })
          .then((response) => {
            console.log('respose--->', response.data.data);
            setData(response.data.data);
          })
          .catch((error) => console.log(error))
    } catch (error) {
      console.error('Error fetching data:', error);
    }
    
  };
  */
const INITIAL_REGION = {
  latitude: 37.33,
  longitude: -122,
  latitudeDelta: 2,
  longitudeDelta: 2
};

  const navigation = useNavigation();
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={focusMap}>
          <View style={{ padding: 10 }}>
            <Text>Focus</Text>
          </View>
        </TouchableOpacity>
      )
    });
  }, []);

  const focusMap = () => {
    const GreenBayStadium = {
      latitude: 44.5013,
      longitude: -88.0622,
      latitudeDelta: 0.1,
      longitudeDelta: 0.1
    };

    mapRef.current?.animateToRegion(GreenBayStadium);

    // Or change the camera with a duration
    // mapRef.current?.animateCamera({ center: GreenBayStadium, zoom: 10 }, { duration: 2000 });
  };
const onMarkerSelected = (marker: any) => {
    //Alert.alert(marker.name);
  };

  const calloutPressed = (ev: any) => {
    console.log(ev);
  };
  const onRegionChange = (region: Region) => {
    console.log(region);
  };
 const markersvoid = [
  // San Francisco
  {
    latitude: 37.7749,
    longitude: -122.4194,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
    name: 'San Francisco City Center'
  },
  {
    latitude: 37.8077,
    longitude: -122.475,
    latitudeDelta: 0.01,
    longitudeDelta: 0.01,
    name: 'Golden Gate Bridge'
  }
];
 
 const [markers, setMarkers] = useState([
    {
      latitude: 32.208080,
      longitude: -110.965510,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
      name: 'San Francisco City Center'
    }
  ]);
  return (
    <>

    <View style={{ flex: 1 }}>
      <MapView
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        showsUserLocation
        showsMyLocationButton
        ref={mapRef}
        provider={PROVIDER_GOOGLE}
        onRegionChangeComplete={onRegionChange}
      >
      {userLocation && <Marker coordinate={userLocation.coords} />}
        {markers.map( (marker, index) => (
          marker.latitude ?
          (<Marker
            key={index}
            title={marker.name}
            coordinate={marker}
            onPress={() => onMarkerSelected(marker)}
          >
            <Callout onPress={calloutPressed}>
              <View style={{ padding: 10 }}>
                <Text style={{ fontSize: 24 }}>{marker.name}</Text>
              </View>
            </Callout>
          </Marker>)
          : null
        ))}    
          <MapViewDirections
            origin={userLocation ? userLocation?.coords : null}
            destination={markers[0]}
            apikey={API_KEY}
            strokeColor="hotpink"
            strokeWidth={4}
          />                 
      </MapView>
    </View>
      <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => String(item.id)}
        renderItem={({ item }) => (
          <View style={styles.item}>
            <Text>{item.name} {item.latitude} </Text>
          </View>
        )}
      />
        
      </View>

    </>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop:70,
    flex: 1,
    justifyContent:'center',
    alignItems:'center',
    padding: 16,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  item: {
    backgroundColor: '#f5f5f5',
    padding: 10,
    marginVertical: 8,
    borderRadius: 8,
  },
});

export default App;