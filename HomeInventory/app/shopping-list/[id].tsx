import { useState } from 'react';
import { View, StyleSheet, FlatList, Pressable, Alert, TextInput } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ThemedView } from '@/components/themed-view';
import { ThemedText } from '@/components/themed-text';
import useShoppingListStore from '@/store/shoppingListStore';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { ShoppingListItem } from '@/types/ShoppingList';

export default function ShoppingListDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const colorScheme = useColorScheme();
  const { shoppingLists, addProductToList, toggleItemTaken, finishShopping } = useShoppingListStore();
  const list = shoppingLists.find((l) => l.id === id);

  const [newItemName, setNewItemName] = useState('');
  const [newItemQuantity, setNewItemQuantity] = useState('1');

  if (!list) {
    return (
      <ThemedView style={styles.container}>
        <ThemedText>Nie znaleziono listy.</ThemedText>
      </ThemedView>
    );
  }

  const handleAddItem = async () => {
    const quantity = parseInt(newItemQuantity, 10);
    if (newItemName.trim() && !isNaN(quantity) && quantity > 0) {
      try {
        await addProductToList(list.id, { name: newItemName.trim(), quantity });
        setNewItemName('');
        setNewItemQuantity('1');
      } catch (e) {
        Alert.alert('Błąd', 'Nie udało się dodać produktu.');
      }
    } else {
      Alert.alert('Błąd', 'Wprowadź poprawną nazwę i ilość.');
    }
  };

  const { user } = useAuthStore();

  const handleFinishShopping = async () => {
    if (!user) {
      Alert.alert('Błąd', 'Musisz być zalogowany.');
      return;
    }
    Alert.alert(
      'Zakończ zakupy',
      'Czy na pewno chcesz zakończyć zakupy i zaktualizować stan domowy?',
      [
        { text: 'Anuluj', style: 'cancel' },
        {
          text: 'Zakończ',
          onPress: async () => {
            await finishShopping(list.id, user.uid);
            router.back();
          },
          style: 'destructive',
        },
      ]
    );
  };

  const renderItem = ({ item }: { item: ShoppingListItem }) => (
    <View style={[styles.itemContainer, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
      <Pressable style={styles.itemContent} onPress={() => toggleItemTaken(list.id, item.id, item.isTaken)}>
        <IconSymbol name={item.isTaken ? 'checkmark.circle.fill' : 'circle'} size={24} color={Colors.light.tint} />
        <ThemedText style={[styles.itemName, item.isTaken && styles.itemTaken]}>
          {item.name} ({item.quantity})
        </ThemedText>
      </Pressable>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedText type="title" style={{ marginBottom: 20 }}>{list.name}</ThemedText>

      {list.status === 'aktywna' && (
        <View style={styles.addForm}>
          <TextInput
            placeholder="Nazwa produktu"
            value={newItemName}
            onChangeText={setNewItemName}
            style={[styles.input, { color: Colors[colorScheme ?? 'light'].text, borderColor: Colors[colorScheme ?? 'light'].text }]}
            placeholderTextColor={Colors.dark.icon}
          />
          <TextInput
            placeholder="Ilość"
            value={newItemQuantity}
            onChangeText={setNewItemQuantity}
            keyboardType="numeric"
            style={[styles.input, styles.quantityInput, { color: Colors[colorScheme ?? 'light'].text, borderColor: Colors[colorScheme ?? 'light'].text }]}
            placeholderTextColor={Colors.dark.icon}
          />
          <Pressable onPress={handleAddItem} style={styles.addButton}>
            <ThemedText style={styles.buttonText}>Dodaj</ThemedText>
          </Pressable>
        </View>
      )}

      <FlatList
        data={list.items}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={<ThemedText>Brak produktów na liście.</ThemedText>}
      />

      {list.status === 'aktywna' && (
        <Pressable onPress={handleFinishShopping} style={[styles.button, styles.finishButton]}>
          <ThemedText style={styles.buttonText}>Zakończ zakupy</ThemedText>
        </Pressable>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  itemContainer: { padding: 16, borderRadius: 12, marginBottom: 12, flexDirection: 'row', alignItems: 'center' },
  itemContent: { flexDirection: 'row', alignItems: 'center', gap: 15 },
  itemName: { fontSize: 16 },
  itemTaken: { textDecorationLine: 'line-through', color: 'gray' },
  addForm: { flexDirection: 'row', marginBottom: 20, gap: 10 },
  input: { borderWidth: 1, padding: 10, borderRadius: 8, flex: 1 },
  quantityInput: { flex: 0.4 },
  button: { backgroundColor: Colors.light.tint, padding: 15, borderRadius: 8, alignItems: 'center' },
  addButton: { justifyContent: 'center', paddingHorizontal: 15, backgroundColor: Colors.light.tint, borderRadius: 8 },
  finishButton: { marginTop: 20, backgroundColor: 'green' },
  buttonText: { color: 'white', fontWeight: 'bold' },
});
