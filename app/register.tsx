import { router, Link } from 'expo-router';
import { Text, View, StyleSheet } from "react-native";
import RegisterForm from '@/components/RegisterForm';
import SegmentedControl from '@react-native-segmented-control/segmented-control';
import React, { useState, useEffect, useRef } from 'react';
import LoginForm from '@/components/LoginForm';

const s = require('@/components/style');

export default function Register() {
  const [formState, setFormState] = useState( 0 );
  
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
      <View style={{ width:'100%'}}>
        <SegmentedControl
            style={{height:70}}
            name='formState'
            values={['Log In', 'Register']}
            selectedIndex={formState}
            onChange={(event) => { setFormState(event.nativeEvent.selectedSegmentIndex) }}
          />	
        </View>
        { (formState ) ? (							

      <RegisterForm style={styles.form}/>
        ) : (      <LoginForm style={styles.form}/>    
        )    
    }
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    position:'absolute',
    top: '50%'
  },
  text: {
    color: '#fff',
  },
});