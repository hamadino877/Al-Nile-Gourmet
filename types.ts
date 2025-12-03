export interface Size {
  size_ar: string;
  size_en: string;
  price: number;
}

export interface MenuItem {
  id: number;
  name_ar: string;
  name_en: string;
  price: number; // Base price or starting price
  badge?: 'bestseller' | 'new' | 'spicy' | 'special';
  image: string[];
  sizes?: Size[];
}

export interface MenuCategory {
  category_ar: string;
  category_en: string;
  icon: string; // Lucide icon name mapping
  image: string;
  items: MenuItem[];
}

export interface CartItem extends MenuItem {
  cartItemId: string; // unique id for cart entry (combines item id + selected size)
  selectedSize?: Size;
  qty: number;
  finalPrice: number;
}

export type FilterType = 'all' | 'bestseller' | 'special' | 'new' | 'spicy';