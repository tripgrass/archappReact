import { Slot } from 'expo-router';
import { SessionProvider } from '@/utilities/AuthContext';

export default function Root() {
  return (
    <SessionProvider>
      <Slot />
    </SessionProvider>
  );
}