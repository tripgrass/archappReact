import { Text, View, StyleSheet } from "react-native";
import LoginForm from '@/components/LoginForm';
const s = require('@/components/style');


export default function Page() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login</Text>
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