import { View, StyleSheet } from 'react-native';
import { Link, Stack } from 'expo-router';
import { useLocalSearchParams } from 'expo-router';

export default function NotFoundScreen() {
  const { user } = useLocalSearchParams<{ user: string }>();
  return (
    <>
      <Stack.Screen options={{ title: 'Oops! Not Found' }} />
      <View style={styles.container}>
        <Link href="/" style={styles.button}>
          {user} Go back to Home screen!
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#25292e',
    justifyContent: 'center',
    alignItems: 'center',
  },

  button: {
    fontSize: 20,
    textDecorationLine: 'underline',
    color: '#fff',
  },
});