export interface Product {
  id: string;
  name: string;
  quantity: number;
  status: 'Dostępny' | 'Skończony';
  category?: string;
  imageURL?: string;
  householdId: string;
}
