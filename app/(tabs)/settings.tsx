import React, { useState, useEffect } from 'react'
import {Alert, Image, ImageBackground, Platform, Pressable, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View} from 'react-native'
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import {setItem, getItem} from '@/utilities/AsyncStorage';
import { Link } from 'expo-router';

const s = require('@/components/style');
   //setItem('username', 'freeCodeCamp');
import AsyncStorage from '@react-native-async-storage/async-storage';
export default function ProfileScreen() {
   const [selectedIndex, setSelectedIndex] = useState(0);
   const [selectedLocationMode, setSelectedLocationMode] = useState(0);
   const [selectedFeedMode, setSelectedFeedMode] = useState(0);

   useEffect( () => {
      const getData = async () => {
       fillLocationModeVal = await AsyncStorage.getItem('fillLocationMode');
       if( "Manually Fill" == fillLocationModeVal ){
          setSelectedLocationMode(1);
       }
       else{
          setSelectedLocationMode(0);
       }

       fillFeedModeVal = await AsyncStorage.getItem('fillFeedMode');
       if( "Notable" == fillFeedModeVal ){
         setSelectedFeedMode(0);
       }
       else if("All" == fillFeedModeVal) {
         setSelectedFeedMode(1);
       }
       else{
         setSelectedFeedMode(2);         
       }

     };
     getData();  

   }, [] )

   return (
      <ScrollView 
         style={s.mainContainer} 
         contentContainerStyle={s.mainContentContainer}
      >
         <View style={s.formOuterWrapper}>
            <View style={s.formWrapper}>
               <View style={[s.formSection,{marginTop:20}]}>
                  <View style={s.fieldWrapperHalf}>
                     <Text style={s.label}>Location Default Fill Mode : </Text>
                     <SegmentedControl
                        values={['Autofill Current Location', 'Manually Fill']}
                        selectedIndex={selectedLocationMode}
                        onChange={(event) => { setSelectedLocationMode(event.nativeEvent.selectedSegmentIndex) }}
                        onValueChange={(value) =>
                           AsyncStorage.setItem("fillLocationMode", value)
                        }
                     />
                  </View>
               </View>    
               <View style={[s.formSection,{marginTop:30}]}>
                  <View style={s.fieldWrapperHalf}>
                     <Text style={s.label}> Feed Preference (Show only the following types of Artifacts): </Text>
                     <SegmentedControl
                        values={['Notable', 'All', 'Only Mine']}
                        selectedIndex={selectedFeedMode}
                        onChange={(event) => { setSelectedFeedMode(event.nativeEvent.selectedSegmentIndex) }}
                        onValueChange={(value) =>
                           AsyncStorage.setItem("fillFeedMode", value)
                        }
                     />
                  </View>
               </View>    
            </View>
         </View>
      </ScrollView>
   );
 }