import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';
import { router } from 'expo-router';

const AuthContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  session?: string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  session: null,
  isLoading: false,
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}

export async function getResponse() {
  try {
    /*
    const response = await fetch(
      'https://zkd.b51.mytemp.website/api/login',
      {
        method: 'post',
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: "yoitsemailtime@gmail.com",
            password: "12345678",
        })      
      }
    )
    */
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
    console.log('data',data);
    return data;
  } catch (error) {
    console.error("Error:", error);
  }    

}

export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, session], setSession] = useStorageState('session');

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {

          // Perform sign-in logic here
getResponse().then(result => {
    // do things with the result here, like call functions with them
    console.log('result', result);
    setSession(result.access_token);
              router.replace('/');

});

        },
        signOut: () => {
          setSession(null);
        },
        session,
        isLoading,
      }}>
      {children}
    </AuthContext.Provider>
  );
}
