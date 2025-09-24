import { useMemo } from 'react';
import { StyleSheet, SectionList, View, Pressable, Alert, Platform } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { useShoppingListSync } from '@/hooks/use-shopping-list-sync';
import useShoppingListStore from '@/store/shoppingListStore';
import useAuthStore from '@/store/authStore';
import { Link } from 'expo-router';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import type { ShoppingList } from '@/types/ShoppingList';

export default function ShoppingListsScreen() {
  useShoppingListSync();
  const { shoppingLists, createShoppingList } = useShoppingListStore();
  const { user } = useAuthStore();
  const colorScheme = useColorScheme();

  const handleCreateList = () => {
    const createList = async (name: string | null) => {
      if (name && user) {
        try {
          await createShoppingList(name, user.uid);
        } catch (e: any) {
          console.error("Błąd tworzenia listy:", e);
          Alert.alert('Błąd', `Nie udało się utworzyć listy: ${e.message}`);
        }
      }
    };

    if (Platform.OS === 'web') {
      const name = prompt('Wprowadź nazwę dla nowej listy:', 'Moja nowa lista');
      createList(name);
    } else {
      Alert.prompt(
        'Nowa lista zakupów',
        'Wprowadź nazwę dla nowej listy:',
        (name) => createList(name),
        'plain-text',
        'Moja nowa lista'
      );
    }
  };

  const sections = useMemo(() => {
    // Zabezpieczenie przed błędem, gdy shoppingLists jest chwilowo `undefined`
    const lists = Array.isArray(shoppingLists) ? shoppingLists : [];
    const active = lists.filter((list) => list.status === 'aktywna');
    const completed = lists.filter((list) => list.status === 'zakończona');
    return [
      { title: 'Aktywne listy', data: active },
      { title: 'Zakończone listy', data: completed },
    ];
  }, [shoppingLists]);

  const renderItem = ({ item }: { item: ShoppingList }) => (
    <Link href={`/shopping-list/${item.id}`} asChild>
      <Pressable>
        <View style={[styles.itemContainer, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
          <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
          <ThemedText>{new Date(item.createdAt).toLocaleDateString()}</ThemedText>
        </View>
      </Pressable>
    </Link>
  );

  return (
    <ThemedView style={styles.container}>
      <View style={styles.header}>
        <ThemedText type="title">Listy Zakupowe</ThemedText>
        <Pressable onPress={handleCreateList} style={styles.button}>
          <ThemedText style={styles.buttonText}>Utwórz nową listę</ThemedText>
        </Pressable>
      </View>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderSectionHeader={({ section: { title, data } }) =>
          data.length > 0 ? <ThemedText style={styles.sectionHeader}>{title}</ThemedText> : null
        }
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
            <View style={styles.emptyContainer}>
              <ThemedText type="subtitle">Brak list zakupowych</ThemedText>
              <ThemedText>Stwórz swoją pierwszą listę, aby zacząć!</ThemedText>
            </View>
          )}
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  button: {
    backgroundColor: Colors.light.tint,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  listContent: {
    paddingBottom: 32,
  },
  itemContainer: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 50,
  }
});
