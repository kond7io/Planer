import { useEffect } from 'react';
import { ref, query, orderByChild, equalTo, onValue, off } from 'firebase/database';
import { rtdb } from '@/lib/firebase/config';
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
    const listsQuery = query(
      ref(rtdb, 'shoppingLists'),
      orderByChild('householdId'),
      equalTo(householdId)
    );

    const listener = onValue(listsQuery, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const listsArray: ShoppingList[] = Object.keys(data).map(key => ({
          id: key,
          ...data[key],
        }));
        // Sortowanie po stronie klienta, ponieważ RTDB sortuje tylko po jednym kluczu
        listsArray.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setShoppingLists(listsArray);
      } else {
        setShoppingLists([]);
      }
    });

    // Zwracamy funkcję czyszczącą, która odłączy listenera
    return () => off(listsQuery, 'value', listener);
  }, [user, setShoppingLists]);
}