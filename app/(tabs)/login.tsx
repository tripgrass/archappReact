import { Text, View, StyleSheet } from "react-native";
import LoginForm from '@/components/LoginForm';

export default function Page() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Login screen</Text>
      <LoginForm />
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
});