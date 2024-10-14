import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';
import { useSession } from '../../ctx';
import MapView from '../map.web'; 

const API_URL = 'https://zkd.b51.mytemp.website/api/artifacts';

const App = () => {
  const { session, isLoading } = useSession();

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
              Authorization: `Bearer ${session}`,
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

  return (
    <>
    <View style={{ flex: 1 }}>
      <MapView style={StyleSheet.absoluteFill} />
    </View>
      <View style={styles.container}>
        <FlatList
          data={data}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item }) => (
            <View style={styles.item}>
              <Text>{item.name}</Text>
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