import { create } from 'zustand';
import type { Product } from '@/types/Product';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import { doc, setDoc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase/config';

interface ProductState {
  products: Product[];
  setProducts: (products: Product[]) => void;
  toggleProductStatus: (productId: string, currentStatus: 'Dostępny' | 'Skończony') => Promise<void>;
  addProduct: (productData: Omit<Product, 'id'>) => Promise<void>;
  removeProduct: (productId: string) => Promise<void>;
  updateProduct: (productId: string, data: Partial<Omit<Product, 'id' | 'householdId'>>) => Promise<void>;
}

const useProductStore = create<ProductState>((set, get) => ({
  products: [],
  setProducts: (products) => set({ products }),

  toggleProductStatus: async (productId, currentStatus) => {
    const newStatus = currentStatus === 'Dostępny' ? 'Skończony' : 'Dostępny';
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, { status: newStatus });
  },

  addProduct: async (productData) => {
    const newId = uuidv4();
    const productRef = doc(db, 'products', newId);
    await setDoc(productRef, { ...productData, id: newId });
  },

  removeProduct: async (productId) => {
    const productRef = doc(db, 'products', productId);
    await deleteDoc(productRef);
  },

  updateProduct: async (productId, data) => {
    const productRef = doc(db, 'products', productId);
    await updateDoc(productRef, data);
  },
}));

export default useProductStore;
