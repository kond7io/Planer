import { create } from 'zustand';
import type { ShoppingList, ShoppingListItem } from '@/types/ShoppingList';
import { db } from '@/lib/firebase/config';
import { doc, setDoc, updateDoc, arrayUnion, writeBatch } from 'firebase/firestore';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import useProductStore from './productStore'; // Import product store for stock updates

interface ShoppingListState {
  shoppingLists: ShoppingList[];
  setShoppingLists: (lists: ShoppingList[]) => void;
  createShoppingList: (name: string, householdId: string) => Promise<void>;
  addProductToList: (listId: string, item: Omit<ShoppingListItem, 'id' | 'isTaken'>) => Promise<void>;
  toggleItemTaken: (listId: string, itemId: string, isTaken: boolean) => Promise<void>;
  finishShopping: (listId: string, householdId: string) => Promise<void>;
}

const useShoppingListStore = create<ShoppingListState>((set, get) => ({
  shoppingLists: [],
  setShoppingLists: (lists) => set({ shoppingLists: lists }),

  createShoppingList: async (name, householdId) => {
    const newListId = uuidv4();
    const newList: ShoppingList = {
      id: newListId,
      name,
      householdId,
      createdAt: new Date(),
      status: 'aktywna',
      items: [],
    };
    const listRef = doc(db, 'shoppingLists', newListId);
    await setDoc(listRef, newList);
  },

  addProductToList: async (listId, itemData) => {
    const newItem: ShoppingListItem = {
      ...itemData,
      id: uuidv4(),
      isTaken: false,
    };
    const listRef = doc(db, 'shoppingLists', listId);
    await updateDoc(listRef, {
      items: arrayUnion(newItem),
    });
  },

  toggleItemTaken: async (listId, itemId, isTaken) => {
    const lists = get().shoppingLists;
    const list = lists.find((l) => l.id === listId);
    if (!list) return;

    const item = list.items.find((i) => i.id === itemId);
    if (!item) return;

    const updatedItem = { ...item, isTaken: !isTaken };
    const updatedItems = list.items.map((i) => (i.id === itemId ? updatedItem : i));
    const listRef = doc(db, 'shoppingLists', listId);
    await updateDoc(listRef, { items: updatedItems });
  },

  finishShopping: async (listId, householdId) => {
    const batch = writeBatch(db);
    const list = get().shoppingLists.find((l) => l.id === listId);
    if (!list) return;

    const products = useProductStore.getState().products;
    const takenItems = list.items.filter((item) => item.isTaken);

    for (const item of takenItems) {
      // Check if a product with the same name already exists
      const existingProduct = products.find(p => p.name.toLowerCase() === item.name.toLowerCase() && p.householdId === householdId);

      if (existingProduct) {
        // Product exists, update its quantity
        const productRef = doc(db, 'products', existingProduct.id);
        batch.update(productRef, {
          quantity: existingProduct.quantity + item.quantity,
          status: 'Dostępny',
        });
      } else {
        // Product does not exist, create a new one
        const newProductId = uuidv4();
        const newProductRef = doc(db, 'products', newProductId);
        batch.set(newProductRef, {
          id: newProductId,
          name: item.name,
          quantity: item.quantity,
          status: 'Dostępny',
          householdId,
        });
      }
    }

    // Mark the shopping list as 'zakończona'
    const listRef = doc(db, 'shoppingLists', listId);
    batch.update(listRef, { status: 'zakończona' });

    await batch.commit();
  },
}));

export default useShoppingListStore;
