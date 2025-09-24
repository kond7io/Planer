import type { Product } from './Product';

export interface ShoppingListItem {
  id: string;
  productId?: string; // Powiązanie z istniejącym produktem
  name: string;      // Nazwa produktu na liście
  quantity: number;
  isTaken: boolean;  // Czy produkt został wzięty z półki
}

export interface ShoppingList {
  id: string;
  name: string;
  createdAt: string; // W RTDB daty często przechowuje się jako stringi ISO
  householdId: string;
  status: 'aktywna' | 'zakończona';
  items: { [key: string]: ShoppingListItem }; // W RTDB zagnieżdżone listy to obiekty
}
