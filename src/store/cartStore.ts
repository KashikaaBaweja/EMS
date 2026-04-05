import { create } from "zustand";
import type { CartItem, Product } from "@/types";

type CartState = {
  items: CartItem[];
  addItem: (product: Product, quantity: number) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  /** Line-item subtotal (computed from `items`). */
  getTotal: () => number;
};

export const useCartStore = create<CartState>((set, get) => ({
  items: [],

  addItem: (product, quantity) => {
    if (quantity <= 0) return;
    set((state) => {
      const idx = state.items.findIndex((i) => i.product.id === product.id);
      if (idx === -1) {
        return { items: [...state.items, { product, quantity }] };
      }
      const next = [...state.items];
      next[idx] = {
        ...next[idx],
        quantity: next[idx].quantity + quantity,
      };
      return { items: next };
    });
  },

  removeItem: (productId) => {
    set((state) => ({
      items: state.items.filter((i) => i.product.id !== productId),
    }));
  },

  updateQuantity: (productId, quantity) => {
    if (quantity <= 0) {
      get().removeItem(productId);
      return;
    }
    set((state) => ({
      items: state.items.map((i) =>
        i.product.id === productId ? { ...i, quantity } : i,
      ),
    }));
  },

  clearCart: () => set({ items: [] }),

  getTotal: () =>
    get().items.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0,
    ),
}));
