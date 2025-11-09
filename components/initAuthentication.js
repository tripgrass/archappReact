import axios from 'axios';
import { useSession } from '@/utilities/AuthContext';
import { useStorageState } from '../useStorageState';

export async function GetLaravelMachineAuthentication() {
  console.log('GetLaravelMachineAuthentication');
  const [[isLoading, machineSession], setMachineSession] = useStorageState('machineSession');

  try {

    const formdata = new FormData();
    formdata.append("grant_type", "client_credentials");
    formdata.append("client_id", "3");
    formdata.append("client_secret", "JhDsrW9OBavvTZ8IpSsQ1dVQud30bBcAYRC59Hjj");
    formdata.append("scope", "*");

    const requestOptions = {
      method: "POST",
      body: formdata,
      redirect: "follow"
    };

    const response = await fetch("https://zkd.b51.mytemp.website/oauth/token", requestOptions);

    const data = await response.json();
    console.log('data init line 26 initauthentication',data);
      console.log('result', data);
      setMachineSession(data.access_token);

    //return data;
  } catch (error) {
    console.error("Error:", error);
  }    
  return true;
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
          client_secret: "JhDsrW9OBavvTZ8IpSsQ1dVQud30bBcAYRC59Hjj",
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