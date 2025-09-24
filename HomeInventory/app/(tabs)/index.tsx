import { StyleSheet, FlatList, View, Pressable, Alert, TextInput } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import useProductStore from '@/store/productStore';
import type { Product } from '@/types/Product';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { auth } from '@/lib/firebase/config';
import { signOut } from 'firebase/auth';
import { Link, useRouter } from 'expo-router';
import { useFirebaseSync } from '@/hooks/use-firebase-sync';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { useMemo, useState } from 'react';

export default function HomeScreen() {
  useFirebaseSync(); // Inicjalizacja synchronizacji z Firebase
  const { products, toggleProductStatus } = useProductStore();
  const colorScheme = useColorScheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortOrder, setSortOrder] = useState<'name' | 'status'>('name');

  const filteredAndSortedProducts = useMemo(() => {
    let filtered = products.filter((product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    filtered.sort((a, b) => {
      if (sortOrder === 'name') {
        return a.name.localeCompare(b.name);
      }
      if (sortOrder === 'status') {
        return a.status.localeCompare(b.status);
      }
      return 0;
    });

    return filtered;
  }, [products, searchQuery, sortOrder]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/(auth)/login');
    } catch (error: any) {
      Alert.alert('Błąd wylogowania', error.message);
    }
  };

  const renderItem = ({ item }: { item: Product }) => (
    <View style={[styles.productContainer, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
      <View style={styles.productInfo}>
        <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
        <ThemedText style={item.status === 'Skończony' ? styles.finished : styles.available}>
          {item.status} ({item.quantity})
        </ThemedText>
      </View>
      <View style={styles.actionsContainer}>
        <Pressable
          onPress={(e) => {
            e.stopPropagation();
            toggleProductStatus(item.id, item.status);
          }}
          style={({ pressed }) => [
            styles.button,
            { backgroundColor: pressed ? Colors.light.tint : Colors.dark.tint },
          ]}
        >
          <ThemedText style={styles.buttonText}>
            {item.status === 'Dostępny' ? 'Skończone' : 'Uzupełnij'}
          </ThemedText>
        </Pressable>
        <Link href={`/edit-product/${item.id}`} asChild>
          <Pressable style={styles.editButton}>
            <IconSymbol name="pencil" size={18} color="white" />
          </Pressable>
        </Link>
      </View>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={filteredAndSortedProducts}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => (
          <>
            <View style={styles.header}>
              <ThemedText type="title">Twoje produkty</ThemedText>
              <Pressable onPress={handleLogout} style={styles.logoutButton}>
                <ThemedText style={styles.buttonText}>Wyloguj</ThemedText>
              </Pressable>
            </View>
            <TextInput
              placeholder="Szukaj produktów..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              style={[styles.searchInput, { color: Colors[colorScheme ?? 'light'].text, borderColor: Colors[colorScheme ?? 'light'].text }]}
              placeholderTextColor={Colors.dark.icon}
            />
            <View style={styles.sortContainer}>
              <ThemedText>Sortuj wg:</ThemedText>
              <Pressable onPress={() => setSortOrder('name')} style={[styles.sortButton, sortOrder === 'name' && styles.activeSort]}>
                <ThemedText style={styles.buttonText}>Nazwy</ThemedText>
              </Pressable>
              <Pressable onPress={() => setSortOrder('status')} style={[styles.sortButton, sortOrder === 'status' && styles.activeSort]}>
                <ThemedText style={styles.buttonText}>Statusu</ThemedText>
              </Pressable>
            </View>
          </>
        )}
        ListEmptyComponent={() => (
          <View style={styles.emptyContainer}>
            <ThemedText type="subtitle">Brak produktów</ThemedText>
            <ThemedText>Dodaj swój pierwszy produkt, klikając przycisk "+" poniżej.</ThemedText>
          </View>
        )}
      />
      <Link href="/add-product" asChild>
        <Pressable style={styles.fab}>
          <IconSymbol name="plus" size={24} color="white" />
        </Pressable>
      </Link>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  listContent: {
    paddingBottom: 32,
    gap: 12,
  },
  productContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
  },
  productInfo: {
    gap: 4,
    flex: 1,
  },
  actionsContainer: {
    flexDirection: 'row',
    gap: 8,
  },
  available: {
    color: 'green',
  },
  finished: {
    color: 'red',
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  editButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: 'orange',
    justifyContent: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  logoutButton: {
    backgroundColor: 'grey',
    padding: 10,
    borderRadius: 5,
  },
  fab: {
    position: 'absolute',
    right: 20,
    bottom: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.light.tint,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  },
  searchInput: {
    height: 40,
    borderWidth: 1,
    paddingHorizontal: 15,
    borderRadius: 8,
    fontSize: 16,
    marginBottom: 10,
  },
  sortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  sortButton: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: 'grey',
    borderRadius: 6,
  },
  activeSort: {
    backgroundColor: Colors.light.tint,
  },
});
