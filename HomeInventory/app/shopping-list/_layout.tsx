import { Stack } from 'expo-router';

export default function ShoppingListLayout() {
  return <Stack screenOptions={{ headerShown: true, headerTitle: 'Lista Zakupów' }} />;
}
