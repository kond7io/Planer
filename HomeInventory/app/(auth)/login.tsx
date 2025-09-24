import { useState }s from 'react';
import { View, TextInput, Pressable, StyleSheet, Alert } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { auth } from '@/lib/firebase/config';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { Link, useRouter } from 'expo-router';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Błąd', 'Proszę wypełnić wszystkie pola.');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      // Nawigacja do głównej części aplikacji po udanym logowaniu
      router.replace('/(tabs)');
    } catch (error: any) {
      Alert.alert('Błąd logowania', error.message);
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = [
    styles.input,
    {
      borderColor: Colors[colorScheme ?? 'light'].text,
      color: Colors[colorScheme ?? 'light'].text,
    }
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Logowanie</ThemedText>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="E-mail"
        style={inputStyle}
        placeholderTextColor={Colors.dark.icon}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Hasło"
        style={inputStyle}
        placeholderTextColor={Colors.dark.icon}
        secureTextEntry
      />
      <Pressable onPress={handleLogin} style={styles.button} disabled={loading}>
        <ThemedText style={styles.buttonText}>{loading ? 'Logowanie...' : 'Zaloguj się'}</ThemedText>
      </Pressable>
      <Link href="/(auth)/register" style={styles.link}>
        <ThemedText type="link">Nie masz konta? Zarejestruj się</ThemedText>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 20,
    justifyContent: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
  },
  button: {
    backgroundColor: Colors.light.tint,
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  link: {
    marginTop: 10,
    textAlign: 'center',
  },
});
