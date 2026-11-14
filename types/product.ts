export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  rating?: number;
  tags?: string[];
  description?: string;
  isBestSeller?: boolean;
  customOrderId?: string;
}

export interface ProductStore {
  product: Product | null;
  setProduct: (p: Product) => void;
}

export interface ProductGridProps {
  products: Product[];
}
