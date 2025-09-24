import { create } from 'zustand';
import type { ShoppingList, ShoppingListItem } from '@/types/ShoppingList';
import { rtdb } from '@/lib/firebase/config'; // Zmieniony import na rtdb
import { ref, set, update, push, child } from 'firebase/database';
import useProductStore from './productStore';
import { doc, writeBatch } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

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
    const newListRef = push(child(ref(rtdb), 'shoppingLists'));
    const newListId = newListRef.key;
    if (!newListId) return;

    const newList: Omit<ShoppingList, 'id'> = {
      name,
      householdId,
      createdAt: new Date().toISOString(), // RTDB preferuje stringi ISO
      status: 'aktywna',
      items: {}, // W RTDB obiekty są lepsze niż tablice
    };
    await set(newListRef, newList);
  },

  addProductToList: async (listId, itemData) => {
    const newItemRef = push(child(ref(rtdb), `shoppingLists/${listId}/items`));
    const newItemId = newItemRef.key;
    if (!newItemId) return;

    const newItem: ShoppingListItem = {
      ...itemData,
      id: newItemId,
      isTaken: false,
    };
    await set(newItemRef, newItem);
  },

  toggleItemTaken: async (listId, itemId, isTaken) => {
    const itemRef = ref(rtdb, `shoppingLists/${listId}/items/${itemId}/isTaken`);
    await set(itemRef, !isTaken);
  },

  finishShopping: async (listId, householdId) => {
    const list = get().shoppingLists.find((l) => l.id === listId);
    if (!list || !list.items) return;

    // Logika aktualizacji Firestore pozostaje taka sama, ale dane wejściowe się zmieniają
    const batch = writeBatch(db);
    const products = useProductStore.getState().products;
    const takenItems = Object.values(list.items).filter((item) => item.isTaken);

    for (const item of takenItems) {
      const existingProduct = products.find(p => p.name.toLowerCase() === item.name.toLowerCase() && p.householdId === householdId);

      if (existingProduct) {
        const productRef = doc(db, 'products', existingProduct.id);
        batch.update(productRef, {
          quantity: existingProduct.quantity + item.quantity,
          status: 'Dostępny',
        });
      } else {
        const newProductId = push(child(ref(rtdb), 'products')).key; // To powinno być w Firestore
        const newProductRef = doc(db, 'products', newProductId!);
        batch.set(newProductRef, {
          id: newProductId,
          name: item.name,
          quantity: item.quantity,
          status: 'Dostępny',
          householdId,
        });
      }
    }
    await batch.commit();

    // Na koniec oznaczamy listę jako zakończoną w Realtime Database
    const listStatusRef = ref(rtdb, `shoppingLists/${listId}/status`);
    await set(listStatusRef, 'zakończona');
  },
}));

export default useShoppingListStore;