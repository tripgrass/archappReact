import axios from 'axios';

export const axiosWrapper = {
    get,
    post,
    put,
    delete: _delete
};

const baseUrl = 'https://zkd.b51.mytemp.website/api/';
const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN;

function get( url ) {
    const config = {
        method: 'GET',
        headers: authHeader(),
        maxBodyLength: Infinity,
        url: baseUrl + url,
        headers: { 
            'Accept': 'application/json',
            'Authorization': `Bearer ${API_TOKEN}`,
            "Content-Type": "multipart/form-data"                         
        }        
    };
    console.log('config',config);
    return axios.request(config).then( (result) => {
            console.log('axios request success:');

            if( 'undefined' != typeof result.data ){
                console.log('axios request return:',result.data.data);
                return result.data.data;
            }
        })
        .catch((error) => {
            handleResponse(error);
        })

}

function post(url, body) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) },
        credentials: 'include',
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);
}

function put(url, body) {
    const requestOptions = {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', ...authHeader(url) },
        body: JSON.stringify(body)
    };
    return fetch(url, requestOptions).then(handleResponse);    
}

// prefixed with underscored because delete is a reserved word in javascript
function _delete(url) {
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