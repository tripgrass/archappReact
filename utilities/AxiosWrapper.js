import axios from 'axios';
import * as SecureStore from 'expo-secure-store';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native'


 
export const axiosWrapper = async function({
        method,
        url,
        data,
        params = {}
    }){
    const baseUrl = 'https://zkd.b51.mytemp.website/api/';
    const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN; // or usesession
    //console.log('API_TOKEN',API_TOKEN);
    const userSessionStore = ( Platform.OS !== "web" ) ? await SecureStore.getItemAsync("userSession") : await AsyncStorage.getItem("userSession");
    const userSession =  userSessionStore ? JSON.parse(userSessionStore) : null;
    const token = userSession?.token ? userSession?.token : API_TOKEN;
    const user = userSession?.user ? userSession?.user : null;
        //console.log('in else!!!!!!!!');
        //console.log('token',token);

    switch (method) {
        case 'get':
            params.user = user;
            const getConfig = {
                method: 'GET',
                headers: authHeader(),
                maxBodyLength: Infinity,
                params:params,
                url: baseUrl + url,
                headers: { 
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"                         
                }        
            };    
            const results = await axios.request(getConfig).then( (result) => {
                console.log('in wrapper results', results);
                if( 'undefined' != typeof result.data ){
                   // console.log('axios request return:',result.data.data);
                    return result.data.data;
                }
            })
            .catch((error) => {
                handleResponse(error);
            })
            return results;
            

        case 'post':
            const postConfig = {
                method: 'post',
                maxBodyLength: Infinity,
                data:data,
                url: baseUrl + url,                
                headers: { 
                    'Accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"                         
                }
            };
            const postResults = await axios.request(postConfig).catch((error) => {
                console.log(error);
            });
            return postResults;

    case 'delete':
            params.user = user;
            const getDeleteConfig = {
                method: 'DELETE',
                maxBodyLength: Infinity,
                params:params,
                url: baseUrl + url,
                headers: { 
                    'Authorization': `Bearer ${token}`,
                    "Content-Type": "multipart/form-data"                         
                }        
            };    
            const deleteResults = await axios.request(getDeleteConfig).then( (deleteResults) => {
                return deleteResults;
            })
            .catch((error) => {
                console.log('wrapper error', error);
            })
            return deleteResults;
    } 
};




function put(url, body) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) },
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);    
}

// prefixed with underscored because delete is a reserved word in javascript
function _remove(url) {
    const requestOptions = {
        method: 'DELETE',
        headers: authHeader(url)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

// helper functions

function authHeader(url) {
    const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN;
    // return auth header with jwt if user is logged in and request is to the api url
    /*
    const user = userService.userValue;
    const isLoggedIn = user && user.token;
    const isApiUrl = url.startsWith(publicRuntimeConfig.apiUrl);
    if (isLoggedIn && isApiUrl) {
        return { Authorization: `Bearer ${user.token}` };
    } else {
        return {};
    }
    */
    return { 'Authorization': `Bearer ${API_TOKEN}` };
}

function handleResponse(response) {
    console.log('response', response.data);
        const data = response.data;

        return data;
}