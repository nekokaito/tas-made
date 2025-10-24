export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating?: number;
  tags?: string[];
  isBestSeller?: boolean;
}

export interface ProductStore {
  product: Product | null;
  setProduct: (p: Product) => void;
}

export interface ProductGridProps {
  products: Product[];
}
