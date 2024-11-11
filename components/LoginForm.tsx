import * as React from 'react';
import { useState, useEffect } from "react";
import { Text, View, StyleSheet, TextInput, Button, Alert } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import Constants from 'expo-constants';
import axios from 'axios';

import { useSession } from '@/utilities/AuthContext';
import { router } from 'expo-router';

export default () => {

  const { register, setError, setValue, handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      email: '',
      password: ''
    }
  });
  const onSubmit = data => {
    const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN;
    try {
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        data:{
          email:data.email,
          password:data.password
        },
        url: 'https://zkd.b51.mytemp.website/api/login',
        headers: { 
          'Accept': 'application/json',
          'Authorization': `Bearer ${API_TOKEN}`         
        }
      };
      axios.request(config)
        .then( (result) => {
          console.log('login result', result.data);
          if( 'undefined' != typeof result.data ){
            //setMachineSession("stuff");
            signIn(result.data);
            router.replace('/(tabs)');
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
 const { signIn } = useSession();
  const onChange = arg => {
    return {
      value: arg.nativeEvent.text,
    };
  };
 <View style={styles.container}>

      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        render={({field: { onChange, onBlur, value }}) => (
          <TextInput
            {...register('email', 
              { 
                required: 'Email is required', 
                pattern: { value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message: 'Invalid email address' } 
              }
            )}
            style={styles.input}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
            errors={errors}
          />
        )}
        name="email"
        rules={{ required: true }}

      />
      <Text style={{color:'white', height:'30px'}}>
        {errors.email && errors.email.message }
      </Text>

      <Text style={styles.label}>Password</Text>
      <Controller
        control={control}
        render={({field: { onChange, onBlur, value }}) => (
          <TextInput
            secureTextEntry={true}        
            style={styles.input}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
          />
        )}
        name="password"
        rules={{ required: true }}
      />

      <View style={styles.button}>
        <Button
          style={styles.buttonInner}
          color
          title="Reset"
          onPress={() => {
            reset({
              email: 'yoitsemailtime@gmail.com',
              password: '12345678'
            })
          }}
        />
      </View>

      <View style={styles.button}>
        <Button
          style={styles.buttonInner}
          color
          title="Sign In"
          onPress={handleSubmit(onSubmit)}
        />
      </View>  
    </View>


  return (
    <View style={styles.container}>

      <Text style={styles.label}>Email</Text>
      <Controller
        control={control}
        render={({field: { onChange, onBlur, value }}) => (
          <TextInput
            {...register('email', 
              { 
                required: 'Email is required', 
                pattern: { value: /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/, message: 'Invalid email address' } 
              }
            )}
            style={styles.input}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
            errors={errors}
          />
        )}
        name="email"
        rules={{ required: true }}

      />
      <Text style={{color:'white', height:'30px'}}>
        {errors.email && errors.email.message }
      </Text>

      <Text style={styles.label}>Password</Text>
      <Controller
        control={control}
        render={({field: { onChange, onBlur, value }}) => (
          <TextInput
            secureTextEntry={true}        
            style={styles.input}
            onBlur={onBlur}
            onChangeText={value => onChange(value)}
            value={value}
          />
        )}
        name="password"
        rules={{ required: true }}
      />

      <View style={styles.button}>
        <Button
          style={styles.buttonInner}
          color
          title="Reset"
          onPress={() => {
            reset({
              email: 'yoitsemailtime@gmail.com',
              password: '12345678'
            })
          }}
        />
      </View>

      <View style={styles.button}>
        <Button
          style={styles.buttonInner}
          color
          title="Sign In"
          onPress={handleSubmit(onSubmit)}
        />
      </View>  
    </View>
  );
};

const styles = StyleSheet.create({
  label: {
    color: 'white',
    margin: 20,
    marginLeft: 0,
  },
  button: {
    marginTop: 40,
    color: 'white',
    height: 40,
    backgroundColor: '#ec5990',
    borderRadius: 4,
  },
  container: {
    flex: 1,
    padding:20,
    maxWidth:'400px',
    width:'100%',
    justifyContent: 'center',
    paddingTop: Constants.statusBarHeight,
    backgroundColor: '#0e101c',
  },
  input: {
    backgroundColor: 'white',
    borderColor: 'none',
    height: 40,
    padding: 10,
    borderRadius: 4,
  },
});
