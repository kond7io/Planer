import { useEffect } from 'react';
import { collection, query, where, onSnapshot } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';
import useProductStore from '@/store/productStore';
import useAuthStore from '@/store/authStore';
import type { Product } from '@/types/Product';

export function useFirebaseSync() {
  const { user } = useAuthStore();
  const { setProducts } = useProductStore();

  useEffect(() => {
    if (!user) {
      // Jeśli użytkownik nie jest zalogowany, czyścimy listę produktów
      setProducts([]);
      return;
    }

    // Używamy UID użytkownika jako householdId
    const householdId = user.uid;
    const productsCollection = collection(db, 'products');
    const q = query(productsCollection, where('householdId', '==', householdId));

    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const products: Product[] = [];
      querySnapshot.forEach((doc) => {
        products.push({ id: doc.id, ...doc.data() } as Product);
      });
      setProducts(products);
    });

    // Zwracamy funkcję czyszczącą, która zostanie wywołana przy odmontowywaniu komponentu
    return () => unsubscribe();
  }, [user, setProducts]);
}
