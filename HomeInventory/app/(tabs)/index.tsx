import { StyleSheet, FlatList, View, Button, Pressable } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import useProductStore from '@/store/productStore';
import type { Product } from '@/types/Product';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';

export default function HomeScreen() {
  const { products, toggleProductStatus } = useProductStore();
  const colorScheme = useColorScheme();

  const renderItem = ({ item }: { item: Product }) => (
    <View style={[styles.productContainer, { backgroundColor: Colors[colorScheme ?? 'light'].card }]}>
      <View style={styles.productInfo}>
        <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
        <ThemedText
          style={item.status === 'Skończony' ? styles.finished : styles.available}
        >
          {item.status} ({item.quantity})
        </ThemedText>
      </View>
      <Pressable
        onPress={() => toggleProductStatus(item.id)}
        style={({ pressed }) => [
          styles.button,
          {
            backgroundColor: pressed ? Colors.light.tint : Colors.dark.tint,
          },
        ]}
      >
        <ThemedText style={styles.buttonText}>
          {item.status === 'Dostępny' ? 'Skończone' : 'Uzupełnij'}
        </ThemedText>
      </Pressable>
    </View>
  );

  return (
    <ThemedView style={styles.container}>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListHeaderComponent={() => <ThemedText type="title" style={{ marginBottom: 16 }}>Twoje produkty</ThemedText>}
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
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  }
});
