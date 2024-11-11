import { router, Link } from 'expo-router';
import { Text, View, StyleSheet } from "react-native";
import LoginForm from '@/components/LoginForm';

import { useSession } from '@/utilities/AuthContext';

export default function SignIn() {
  const { signIn } = useSession();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <LoginForm style={styles.form}/>    
      
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    alignItems: 'center',
    justifyContent: 'center',
  },
  form: {
    backgroundColor: 'blue',    
    position:'absolute',
    top: '50%'
  },
  text: {
    color: '#fff',
  },
});