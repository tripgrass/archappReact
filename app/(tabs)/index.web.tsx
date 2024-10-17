import { Text, View, StyleSheet } from "react-native";
import { Link } from 'expo-router';
const s = require('@/components/style');

export default function Index() {
  return (
    <View style={styles.container}>
      <Text >Home for web screen</Text>
       <Link href="/login" style={styles.link}>Login</Link>      
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
  text: {
    color: '#fff',
  },
  link:{
    color: 'white'
  },
});