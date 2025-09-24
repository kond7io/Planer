import { useState } from 'react';
import { TextInput, StyleSheet, Platform, Pressable, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import useProductStore from '@/store/productStore';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';
import useAuthStore from '@/store/authStore';

export default function AddProductModal() {
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [category, setCategory] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [loading, setLoading] = useState(false);
  const { addProduct } = useProductStore();
  const { user } = useAuthStore();
  const router = useRouter();
  const colorScheme = useColorScheme();

  const handleSave = async () => {
    if (!user) {
      Alert.alert('Błąd', 'Musisz być zalogowany, aby dodać produkt.');
      return;
    }

    const numQuantity = parseInt(quantity, 10);
    if (name.trim() && !isNaN(numQuantity) && numQuantity > 0) {
      setLoading(true);
      try {
        const productData: any = {
          name: name.trim(),
          quantity: numQuantity,
          status: 'Dostępny',
          householdId: user.uid,
        };

        if (category.trim()) {
          productData.category = category.trim();
        }
        if (imageURL.trim()) {
          productData.imageURL = imageURL.trim();
        }

        await addProduct(productData);
        router.back();
      } catch (error: any) {
        // To wyświetli pełny błąd w konsoli, w której uruchomiłeś aplikację
        console.error("Błąd zapisu do Firebase:", error);

        // To pokaże szczegółową wiadomość o błędzie w alercie na telefonie
        Alert.alert('Błąd zapisu', `Wystąpił problem: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Błąd walidacji', 'Proszę podać poprawną nazwę i ilość.');
    }
  };

  const inputStyle = [
    styles.input,
    {
      borderColor: Colors[colorScheme ?? 'light'].text,
      color: Colors[colorScheme ?? 'light'].text,
    },
  ];

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title">Dodaj nowy produkt</ThemedText>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Nazwa produktu (np. Mleko)"
        style={inputStyle}
        placeholderTextColor={Colors.dark.icon}
      />
      <TextInput
        value={quantity}
        onChangeText={setQuantity}
        placeholder="Ilość"
        style={inputStyle}
        keyboardType="numeric"
        placeholderTextColor={Colors.dark.icon}
      />
      <TextInput
        value={category}
        onChangeText={setCategory}
        placeholder="Kategoria (opcjonalnie)"
        style={inputStyle}
        placeholderTextColor={Colors.dark.icon}
      />
      <TextInput
        value={imageURL}
        onChangeText={setImageURL}
        placeholder="URL zdjęcia (opcjonalnie)"
        style={inputStyle}
        keyboardType="url"
        placeholderTextColor={Colors.dark.icon}
      />

      <Pressable onPress={handleSave} style={styles.button} disabled={loading}>
        <ThemedText style={styles.buttonText}>{loading ? 'Zapisywanie...' : 'Zapisz produkt'}</ThemedText>
      </Pressable>

      {Platform.OS === 'ios' && (
        <Pressable onPress={() => router.back()} style={[styles.button, styles.cancelButton]} disabled={loading}>
          <ThemedText style={styles.buttonText}>Anuluj</ThemedText>
        </Pressable>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    gap: 20,
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
  cancelButton: {
    backgroundColor: '#555',
  }
});
