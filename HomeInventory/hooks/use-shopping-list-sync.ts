import { useEffect } from 'react';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import useShoppingListStore from '@/store/shoppingListStore';
import useAuthStore from '@/store/authStore';
import type { ShoppingList } from '@/types/ShoppingList';

export function useShoppingListSync() {
  const { user } = useAuthStore();
  const { setShoppingLists } = useShoppingListStore();

  useEffect(() => {
    if (!user) {
      setShoppingLists([]);
      return;
    }

    const householdId = user.uid;
    const listsCollection = collection(db, 'shoppingLists');
    const q = query(
      listsCollection,
      where('householdId', '==', householdId),
      orderBy('createdAt', 'desc')
    );

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const lists: ShoppingList[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        lists.push({
          ...data,
          id: doc.id,
          createdAt: data.createdAt.toDate(), // Konwersja Timestamp na Date
        } as ShoppingList);
      });
      setShoppingLists(lists);
    });

    return () => unsubscribe();
  }, [user, setShoppingLists]);
}
