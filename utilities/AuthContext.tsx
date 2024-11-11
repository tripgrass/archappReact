import { useContext, createContext, type PropsWithChildren } from 'react';
import { useStorageState } from '@/utilities/useStorageState';
import { router } from 'expo-router';


const AuthContext = createContext<{
  signIn: () => void;
  signOut: () => void;
  userSession?:string | null;
  loadingUser: boolean;
}>({
  signIn: () => null,
  signOut: () => null,
  userSession: null,
  loadingUser: false
});

// This hook can be used to access the user info.
export function useSession() {
  const value = useContext(AuthContext);
//  console.log('useSession value', value);
  if (process.env.NODE_ENV !== 'production') {
    if (!value) {
      throw new Error('useSession must be wrapped in a <SessionProvider />');
    }
  }

  return value;
}


export function SessionProvider({ children }: PropsWithChildren) {
  const [ [loadingUser, userSession], setUserSession] = useStorageState('userSession');

  return (
    <AuthContext.Provider
      value={{
        signIn: ( data ) => {
          setUserSession(JSON.stringify(data));
        },
        signOut: () => {
          router.replace('');
          setUserSession(null);
        },
        userSession,
        loadingUser
      }}>
      {children}
    </AuthContext.Provider>
  );
}
