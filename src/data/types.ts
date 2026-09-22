export type Variant = {
  id: number;
  title: string;
  price: number; // what the customer pays (after the store offer)
  mrp: number;
  discount: number; // percent
  available: boolean;
};

export type Product = {
  handle: string;
  title: string;
  category: CategoryId;
  type: string;
  badge: string | null;
  rating: number;
  short: string;
  description: string;
  variants: Variant[];
  images: string[];
  tags: string[];
};

export type CategoryId =
  | 'ghee'
  | 'atta'
  | 'oils'
  | 'breakfast'
  | 'pickles'
  | 'immunity'
  | 'combos'
  | 'membership';
