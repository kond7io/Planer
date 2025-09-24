import { create } from 'zustand';
import type { Product } from '@/types/Product';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

interface ProductState {
  products: Product[];
  toggleProductStatus: (productId: string) => void;
  addProduct: (name: string, quantity: number) => void;
  removeProduct: (productId: string) => void;
  updateProduct: (productId: string, name: string, quantity: number) => void;
}

const useProductStore = create<ProductState>((set) => ({
  products: [
    { id: '1', name: 'Mleko', quantity: 1, status: 'Dostępny' },
    { id: '2', name: 'Chleb', quantity: 1, status: 'Dostępny' },
    { id: '3', name: 'Masło', quantity: 1, status: 'Skończony' },
    { id: '4', name: 'Jajka', quantity: 12, status: 'Dostępny' },
  ],
  toggleProductStatus: (productId) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId
          ? {
              ...product,
              status: product.status === 'Dostępny' ? 'Skończony' : 'Dostępny',
            }
          : product
      ),
    })),
  addProduct: (name, quantity) =>
    set((state) => ({
      products: [
        ...state.products,
        { id: uuidv4(), name, quantity, status: 'Dostępny' },
      ],
    })),
  removeProduct: (productId) =>
    set((state) => ({
      products: state.products.filter((product) => product.id !== productId),
    })),
  updateProduct: (productId, name, quantity) =>
    set((state) => ({
      products: state.products.map((product) =>
        product.id === productId ? { ...product, name, quantity } : product
      ),
    })),
}));

export default useProductStore;
