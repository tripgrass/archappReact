import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import axios from 'axios';


const App = () => {
  const [data, setData] = useState([]);

  useEffect(() => {
    fetchData();
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
      console.log('config',config);
      axios.request(config)
        .then( (result) => {
          console.log('result',result);
          if( 'undefined' != typeof result.data ){
      setData(result.data.data);

            //setMachineSession("stuff");
          }
        })
        .catch((error) => {
          console.log('error', error);
          if( '401' == error.status ){
            setError('email', { type: 'custom', message: 'Password and Email do not match.' });
              console.log('401');
          }
        })
    } catch (error) {
      console.error("Error:", error);
    }           
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Making API Requests</Text>
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