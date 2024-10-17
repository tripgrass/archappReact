import axios from 'axios';
import { useStorageState } from '../useStorageState';

export async function GetLaravelUserAuthentication() {
  console.log('GeeeeetLaravelUserAuthentication');
  const API_TOKEN = process.env.EXPO_PUBLIC_API_TOKEN;

  try {
console.log('try .....');
    const formdata = new FormData();
    formdata.append("name", "rando");

    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://zkd.b51.mytemp.website/api/artifacts?name=what',
      headers: { 
        'Accept': 'application/json',
        'Authorization': `Bearer ${API_TOKEN}`         
      }
    };
console.log('config',config);
    const response = await axios.request(config)
    return response;
  } catch (error) {
    console.error("Error:", error);
  }    
  return;
  /*
  try {
    const connect = async () => {
      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://zkd.b51.mytemp.website/oauth/token',
        params:{
          grant_type:"client_credentials",
          client_id: "3",
          client_secret: "",
          scope: "*"
        },
        headers: { 
          'Accept': 'application/json'
        }
      };

      const response = await axios.request(config)
    const data = await response.json();
    console.log('data',data);
    setMachineSession(data.access_token);

    return data;

    };
  } catch (error) {
    console.error("Error:", error);
  };
  */
}