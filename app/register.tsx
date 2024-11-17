import { router, Link } from 'expo-router';
import { Text, View, StyleSheet } from "react-native";
import RegisterForm from '@/components/RegisterForm';

export default function Register() {
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <RegisterForm style={styles.form}/>    
      
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