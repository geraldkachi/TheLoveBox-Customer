export interface Category {
  _id: string;
  name: string;
  slug: string;
  parent: string | null;
  isGiftType: boolean;
  image?: string;
}

export interface Product {
  _id: string;
  name: string;
  slug: string;
  description?: string;
  images: string[];
  videos?: string[];
  price: number;
  compareAtPrice?: number;
  stock: number;
  sizes?: { label: string; price: number }[];
  categories?: { _id: string; name: string; slug: string }[];
  isFeatured?: boolean;
  updatedAt?: string;
}

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
}
