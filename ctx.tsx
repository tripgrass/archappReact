import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from './useStorageState';
import { router } from 'expo-router';
import {GetLaravelUserAuthentication} from '@/components/GetLaravelUserAuthentication';


const AuthContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  machineSession?: string | null;
  userSession?:string | null;
  isLoading: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  machineSession: null,
  userSession: null,
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


export function SessionProvider({ children }: PropsWithChildren) {
  const [[isLoading, machineSession], setMachineSession] = useStorageState('machineSession');
  const [ [loadingUser, userSession], setUserSession] = useStorageState('userSession');

  return (
    <AuthContext.Provider
      value={{
        signIn: () => {

          // Perform sign-in logic here
          
          GetLaravelUserAuthentication().then(result => {
            console.log('result in sign in', result);
            if( result.data ){
              setMachineSession("stuff");
              setUserSession("stuff");

              router.replace('/');
            }
          });

        },
        signOut: () => {
          setMachineSession( null);
          setUserSession(null);
            console.log('sign out machineSession', machineSession);
            console.log('sign out userSession', userSession);
        },
        machineSession,
        userSession,
        isLoading,
        loadingUser
      }}>
      {children}
    </AuthContext.Provider>
  );
}
