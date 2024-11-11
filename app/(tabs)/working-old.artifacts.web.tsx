import React, { useState, useEffect, useRef } from 'react';
import { Alert, TouchableOpacity, View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import { useSession } from '@/utilities/AuthContext';
//import MapView from '../../components/map'; 
import MapView, { Callout, Marker, PROVIDER_DEFAULT, Region } from 'react-native-maps';
import { useNavigation } from 'expo-router';
const API_URL = 'https://zkd.b51.mytemp.website/api/artifacts';
import { ClusterProps, MarkerClusterer } from '@teovilla/react-native-web-maps';
const App = () => {
  const { machineSession, isLoading } = useSession();
const [region, setRegion] = useState<Region | null>(null);
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

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
const mapRef = useRef<any>(null);    
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
    Alert.alert(marker.name);
  };

  const calloutPressed = (ev: any) => {
    console.log(ev);
  };
  const onRegionChange = (region: Region) => {
    console.log(region);
  };
 const markers = [
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
function MyClusterComponent(props: ClusterProps<{ onPress(): void }>) {
  return (
    <Marker
      onPress={props.onPress}
      coordinate={props.coordinate}
      anchor={{ x: 0.5, y: 0.5 }}
    >
      <View style={styles.cluster}>
        <Text style={styles.clusterText}>{props.pointCountAbbreviated}</Text>
      </View>
    </Marker>
  );
}
  return (
    <>
    <View style={styles.mapContainer}>
      <MapView style={styles.map} 
        initialRegion={{
    latitude: 37.78825,
    longitude: -122.4324,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }}
        provider="google"
        googleMapsApiKey=""
        onRegionChangeComplete={onRegionChange}
      >
        <MarkerClusterer
          region={region}
          renderCluster={(cluster) => (
            <MyClusterComponent
              {...cluster}
              onPress={() =>
                mapRef.current?.animateCamera({
                  center: cluster.coordinate,
                  zoom: cluster.expansionZoom + 3,
                })
              }
            />
          )}
        >
          <Marker
            coordinate={{
              latitude: 59.33956246905637,
              longitude: 18.050015441134114,
            }}
          />
          <Marker
            coordinate={{
              latitude: 59.3442016958775,
              longitude: 18.038256636812825,
            }}
          />
        </MarkerClusterer> 
      </MapView>
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
  mapContainer:{
    height:'80%'
  },
  map:{
    height:'100%'
  }
});

export default App;