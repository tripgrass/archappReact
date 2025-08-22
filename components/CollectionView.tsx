import { Dimensions, FlatList, Image, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { useState, useEffect, useRef } from 'react';
import  {ArtifactsService}  from '@/utilities/ArtifactsService';
import { useLocalSearchParams, useGlobalSearchParams, Link } from 'expo-router';
import { useIsFocused } from '@react-navigation/native'
import Constants from 'expo-constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import axios from 'axios';
import * as Location from "expo-location";
import MapView, { Callout, Marker, PROVIDER_GOOGLE, Region } from 'react-native-maps';
import MapViewDirections from 'react-native-maps-directions';
import CustomButton from '@/components/Button';

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
function CollectionView({ collection, route, navigation, galleryImages, setGalleryImages, setLoadState }) {
	const [currentLocation, setCurrentLocation] = useState(null);
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

    return (
			<>
				<View style={viewStyles.header}>
					<Text style={viewStyles.headerText}>{collection?.name}</Text>

				</View>
					<View style={{display:'flex',flex:1, justifyContent:'center', alignItems:'center', marginTop:150, backgroundColor:'red', width:'100%', height:'100%'}}>
 

    <View style={{ flex: 1, height:screenHeight, width:'100%',}}>
      <MapView
        style={{  backgroundColor:'blue', width:'100%', height:(screenHeight * .75) }}
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
            style={{flex:1}}
            //onPress={() => onMarkerSelected(marker)}
          >
            <Callout onPress={() => onCalloutPressed(marker)} style={{flex:1, height:30, width:100, backgroundColor:'red'}}>
              <View style={{ flex: 1,
        backgroundColor: '#FAAA18',
        borderRadius: 40,
        flexDirection: 'row' }}>
                <Text style={{ fontSize: 24 }}>calllout{marker.name}</Text>
                <Text style={{ fontSize: 24 }}>View</Text>
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
      <View style={styles.containerVoid}>
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

    					
							<>
								<Text>tesr{screenHeight}{collection?.address}</Text>
								<Text>{collection?.city}, {collection?.state}</Text>
							</>
							{galleryImages && galleryImages.length > 0 ? (
								<FlatList
									contentContainerStyle={{ flex:1, justifyContent:'center', alignItems:'center'}}
									horizontal={true} 
									showsHorizontalScrollIndicator={true} 
									data={galleryImages}
									extraData={galleryImages}
									keyExtractor={(item, index) => {return  index.toString();}}
									renderItem={ ({ item, index }) => (
										<View key={item.id} serverId={item.id} style={{}}>
										<Image source={{uri:imageBaseUrl + item.name}} /* Use item to set the image source */
											style={{
												width:150,
												height:150,
												backgroundColor:'#d0d0d0',
												//resizeMode:'contain',
												margin:6
											}}
										/>
										</View>
									)}
								/>
							) : (
								<></>
							)}
							<View
								style={{
									position:'absolute',
									bottom:10,
									left:0,
								}}
							>
									<Pressable collection={collection}
										style={({pressed}) => [
														{
												backgroundColor: pressed ? 'rgb(210, 230, 255)' : 'white',
												alignItems: 'center',
												justifyContent: 'center',
												borderRadius: 40,
												height:80,
												width:80,
												elevation: 8,
												marginLeft: 5,					    		
												boxShadow: '0px 2px 2px #d8d8d8'						        
														}
										]}
										onPress={ () => { navigateToEdit() }}
									>
										<Text>Edit -- {collection.id}</Text>
									</Pressable> 
							</View>
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