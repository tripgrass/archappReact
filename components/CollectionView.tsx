import { Dimensions, FlatList, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useState, useEffect, useRef } from 'react';
import  {ArtifactsService}  from '@/utilities/ArtifactsService';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';
import { useIsFocused } from '@react-navigation/native';
import Constants from 'expo-constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import * as Location from "expo-location";
import MapView, { Callout, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import CustomButton from '@/components/Button';
import { WebView } from 'react-native-webview';
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
function CollectionView({ collection, route, navigation, galleryImages, setGalleryImages, setLoadState, artifactId, setArtifactId }) {
	const [currentLocation, setCurrentLocation] = useState(null);
	const [currentMarker, setCurrentMarker] = useState(null);
	const [initialRegion, setInitialRegion] = useState(null);
	const [userLocation, setUserLocation] = useState(null);
	const mapRef = useRef<any>(null);    

	const API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAP_API_KEY;
	const [data, setData] = useState([]);

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
	    console.log('effect collection', collection.artifacts);
	    fetchData();
	    var newMarkers = [];
		Object.keys(collection.artifacts).forEach((k, i) => {
			console.log("artifact coords:: ", collection.artifacts[k]);
			console.log("i",i);
			 newMarkers.push({
      latitude: collection.artifacts[k].location.coordinates[1],
      longitude: collection.artifacts[k].location.coordinates[0],
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
      id: collection.artifacts[k].id,
      name: collection.artifacts[k].name
    });
			/*
			artifactsList[results[i].id] = results[i];
			if( results[i].images.length > 0 ){
				artifactsCompareList[results[i].id] = results[i];
			}
			*/
		});
		setMarkers(newMarkers);
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
    console.log('collection', collection);
    const isFocused = useIsFocused()
    const local = useLocalSearchParams();
    const collectionId  = ( Platform.OS == "web" ) ? ( local.collectionId ? local.collectionId : null ) : (route?.params?.params ? route?.params?.params?.collectionId : null);
    const onRegionChange = (region: Region) => {
    console.log(region);
  };
  const onMarkerSelected = (marker: any) => {
	console.log('MARKER::::',marker.name);
	console.log('MARKER ID::::',marker.id);
  setCurrentMarker(marker);
	//navigation.navigate('show', { params: { ArtifactId: marker.id } })
    //Alert.alert(marker.name);
  };

	const [collections, setCollections] = useState([]);
	const imageBaseUrl = "https://zkd.b51.mytemp.website/images/";

	const navigateToEdit = () => {

		setLoadState('loading');
		navigation.navigate('edit', { params: { collectionId: collection.id } })
	}
	const onCalloutPressed = ( marker ) => {
		navigation.navigate('show', {
			params: { artifactId: marker.id }
		}) 
	};

	  const calloutPressed = (ev: any) => {
    console.log(ev);
    navigation.navigate('show', { params: { artifactId: marker.id } })
  };
    const screenHeight = Dimensions.get("window").height;

 const [markers, setMarkers] = useState([
    {
      latitude: 32.208080,
      longitude: -110.965510,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
      name: 'San Francisco City Center'
    }
  ]);

  var webHtml = `
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
<link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
     integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
     crossorigin=""/>
     <!-- Make sure you put this AFTER Leaflet's CSS -->
 <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
     integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
     crossorigin=""></script>  
   <div id="map" style="height:100%;"></div>
   <script>

	const map = L.map('map').setView([32.25, -110.97], 13);


  L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png?api_key=5db8b9d4-f0d2-4750-8c2d-ef9058433a91', {
                maxZoom: 30,
                attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a>, &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>',
            }).addTo(map);`;
      for (const element of collection.artifacts) {
 console.log('element', element.location.coordinates[0]);
webHtml += `L.marker([ ` + element.location.coordinates[1] + `, ` + element.location.coordinates[0] + `]).addTo(map).bindPopup(" ` + element.address + `");`; 

}
webHtml += `</script>`;


    return (
			<>
				<View style={viewStyles.header}>
					<Text style={viewStyles.headerText}>{collection?.name}</Text>
				</View>
        <View style={{
            flex:1, width:'100%'
          }}>
    <WebView
      style={{
        flex: 1,
        marginTop: Constants.statusBarHeight
      }}
      originWhitelist={['*']}
      source={{ html: webHtml }}
    />
          </View>	
        </>
    );
}
const styles = StyleSheet.create({
  containerVoid: {
    flex: 1,

  },
  mapContainer: {
  	flex:1,
    backgroundColor: 'yellow',
    height:'100%'
  },
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
const viewStyles = StyleSheet.create({
	
	header:{
		position:'absolute',
		textAlign:'left',
		top:Constants.statusBarHeight + 5,
		left:0,
		right:0,
		backgroundColor:'white'
	},
	headerText:{
		textAlign:'left',
		fontSize:26,
		marginLeft:16,
		lineHeight:72,
		fontWeight:'600'
	}
});
export default CollectionView;