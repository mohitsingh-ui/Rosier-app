import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { storage } from '../store/storage';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const snapshot: Product[] = require('./catalog.json');
import type { CategoryId, Product, Variant } from './types';

export const STORE_URL = 'https://www.rosierfoods.com';

export const CATEGORIES: { id: CategoryId; label: string; icon: string; blurb: string; tint: string }[] = [
  { id: 'ghee', label: 'Ghee', icon: 'ghee', blurb: 'Bilona churned from curd', tint: '#F4E1C4' },
  { id: 'atta', label: 'Atta', icon: 'atta', blurb: 'Stone ground, fibre intact', tint: '#E9E4C9' },
  { id: 'oils', label: 'Oils', icon: 'oil', blurb: 'Stone pressed, never heated', tint: '#F6E6B8' },
  { id: 'breakfast', label: 'Breakfast', icon: 'breakfast', blurb: 'High protein mornings', tint: '#F6D9C7' },
  { id: 'immunity', label: 'Immunity', icon: 'immunity', blurb: 'Honey & Amlaprash', tint: '#F3D6CC' },
  { id: 'pickles', label: 'Pickles', icon: 'pickle', blurb: 'Sun dried like Dadi’s', tint: '#DCEBD0' },
  { id: 'combos', label: 'Combos', icon: 'combo', blurb: 'Buy more, save more', tint: '#EADCF0' },
];

const TYPE_TO_CAT: Record<string, CategoryId> = {
  Ghee: 'ghee',
  Flour: 'atta',
  Oil: 'oils',
  Oats: 'breakfast',
  'Bars/Nutbutters': 'breakfast',
  Pickle: 'pickles',
  Honey: 'immunity',
  Amlaprash: 'immunity',
  Combo: 'combos',
};

type CatalogState = {
  products: Product[];
  updatedAt: number;
  loading: boolean;
  refresh: () => Promise<void>;
};

const clean = (html: string) =>
  (html || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

/** Shopify variant → app variant. Store offers live in `badge_… X% OFF` tags. */
function mapVariants(raw: any): Variant[] {
  let tagDiscount = 0;
  for (const t of raw.tags as string[]) {
    const m = t.startsWith('badge_') && t.match(/(\d+)% OFF/);
    if (m) tagDiscount = Number(m[1]);
  }
  return (raw.variants as any[])
    .map((v) => {
      const price = Number(v.price);
      const cmp = Number(v.compare_at_price || 0);
      if (cmp > price) {
        return { id: v.id, title: v.title, price, mrp: cmp, discount: Math.round(((cmp - price) / cmp) * 100), available: v.available };
      }
      return {
        id: v.id,
        title: String(v.title).replace(/ /g, ' '),
        price: Math.round(price * (1 - tagDiscount / 100)),
        mrp: price,
        discount: tagDiscount,
        available: v.available,
      };
    })
    .filter((v) => v.mrp > 0);
}

const DUPLICATE = /-(rosiervip|nitro17|copy|\d+)$/;

export const useCatalog = create<CatalogState>()(
  persist(
    (set, get) => ({
      products: snapshot,
      updatedAt: 0,
      loading: false,
      refresh: async () => {
        if (get().loading) return;
        set({ loading: true });
        try {
          const res = await fetch(`${STORE_URL}/products.json?limit=250`);
          const json = await res.json();
          const raw: any[] = json.products ?? [];
          const byHandle = new Map(raw.map((p) => [p.handle, p]));
          const known = new Set<string>();
          const merged: Product[] = get().products.map((p) => {
            known.add(p.handle);
            const r = byHandle.get(p.handle);
            if (!r) return p;
            const variants = mapVariants(r);
            return {
              ...p,
              title: r.title?.trim() || p.title,
              variants: variants.length ? variants : p.variants,
              images: r.images?.length ? r.images.slice(0, 6).map((i: any) => i.src) : p.images,
            };
          });
          // Pick up brand-new launches automatically.
          const seenTitles = new Set(merged.map((p) => p.title.toLowerCase()));
          for (const r of raw) {
            const cat = TYPE_TO_CAT[r.product_type];
            if (!cat || known.has(r.handle) || DUPLICATE.test(r.handle)) continue;
            if ((r.tags as string[]).some((t) => /no-recommend|nitro17/i.test(t))) continue;
            if (seenTitles.has(String(r.title).toLowerCase())) continue;
            const variants = mapVariants(r);
            if (!variants.length) continue;
            const body = clean(r.body_html);
            seenTitles.add(String(r.title).toLowerCase());
            merged.unshift({
              handle: r.handle,
              title: r.title,
              category: cat,
              type: r.product_type,
              badge: (r.tags as string[]).find((t) => t.startsWith('tag__'))?.split('_').slice(3).join('_') ?? '🎉 New',
              rating: 4.8,
              short: body.split(/(?<=[.!])\s/).slice(0, 2).join(' ').slice(0, 220),
              description: body.slice(0, 1200),
              variants,
              images: r.images.slice(0, 6).map((i: any) => i.src),
              tags: [],
            });
          }
          set({ products: merged, updatedAt: Date.now() });
        } catch {
          // Offline or blocked — keep the cached catalogue.
        } finally {
          set({ loading: false });
        }
      },
    }),
    { name: 'rosier-catalog', storage, partialize: ({ products, updatedAt }) => ({ products, updatedAt }) },
  ),
);

export const useProducts = () => useCatalog((s) => s.products);

export function findProduct(products: Product[], handle: string) {
  return products.find((p) => p.handle === handle);
}

export function findVariant(products: Product[], variantId: number) {
  for (const p of products) {
    const v = p.variants.find((x) => x.id === variantId);
    if (v) return { product: p, variant: v };
  }
  return undefined;
}

export const defaultVariant = (p: Product) => p.variants.find((v) => v.available) ?? p.variants[0];

export const shopProducts = (products: Product[]) => products.filter((p) => p.category !== 'membership');
