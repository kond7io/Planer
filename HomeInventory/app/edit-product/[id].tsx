import { useState, useEffect } from 'react';
import { TextInput, StyleSheet, Platform, Pressable, Alert } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import useProductStore from '@/store/productStore';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { Colors } from '@/constants/theme';

export default function EditProductModal() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { products, updateProduct, removeProduct } = useProductStore();
  const product = products.find((p) => p.id === id);

  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState('1');
  const [category, setCategory] = useState('');
  const [imageURL, setImageURL] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (product) {
      setName(product.name);
      setQuantity(product.quantity.toString());
      setCategory(product.category || '');
      setImageURL(product.imageURL || '');
    }
  }, [product]);

  if (!product) {
    return <ThemedView style={styles.container}><ThemedText>Nie znaleziono produktu.</ThemedText></ThemedView>;
  }

  const handleUpdate = async () => {
    const numQuantity = parseInt(quantity, 10);
    if (name.trim() && !isNaN(numQuantity) && numQuantity > 0) {
      setLoading(true);
      try {
        const dataToUpdate: {
          name: string;
          quantity: number;
          category?: string;
          imageURL?: string;
        } = {
          name: name.trim(),
          quantity: numQuantity,
        };

        if (category.trim()) {
          dataToUpdate.category = category.trim();
        }
        if (imageURL.trim()) {
          dataToUpdate.imageURL = imageURL.trim();
        }

        await updateProduct(product.id, dataToUpdate);
        router.back();
      } catch (error: any) {
        Alert.alert('Błąd aktualizacji', `Wystąpił problem: ${error.message}`);
      } finally {
        setLoading(false);
      }
    } else {
      Alert.alert('Błąd walidacji', 'Proszę podać poprawną nazwę i ilość.');
    }
  };

  const performDelete = async () => {
    if (!product) return;
    setLoading(true);
    try {
      await removeProduct(product.id);
      router.back();
    } catch (error: any) {
      console.error("Błąd usuwania z Firebase:", error);
      Alert.alert('Błąd usuwania', `Wystąpił problem: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = () => {
    Alert.alert(
      'Usuń produkt',
      'Czy na pewno chcesz usunąć ten produkt?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Usuń',
          onPress: performDelete,
          style: 'destructive',
        },
      ]
    );
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
      <ThemedText type="title">Edytuj produkt</ThemedText>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder="Nazwa produktu"
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

      <Pressable onPress={handleUpdate} style={styles.button} disabled={loading}>
        <ThemedText style={styles.buttonText}>{loading ? 'Zapisywanie...' : 'Zapisz zmiany'}</ThemedText>
      </Pressable>

      <Pressable onPress={handleDelete} style={[styles.button, styles.deleteButton]} disabled={loading}>
        <ThemedText style={styles.buttonText}>Usuń produkt</ThemedText>
      </Pressable>
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
  deleteButton: {
    backgroundColor: 'red',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});