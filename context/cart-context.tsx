"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
} from "react";

export interface CartItem {
  id: string; // Changed from number to string
  name: string;
  price: number;
  quantity: number;
  image: string;
  customization?: string;
  categoryId: string;
  categoryName: string;
}

interface CartContextType {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void; // Changed from number to string
  updateQuantity: (id: string, quantity: number) => void; // Changed from number to string
  clearCart: () => void;
  totalItems: number;
  subtotal: number;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isClient, setIsClient] = useState(false);

  // Handle hydration mismatch by only rendering on client
  useEffect(() => {
    setIsClient(true);

    // Load cart from localStorage if available
    const savedCart = localStorage.getItem("restaurant-cart");
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart);
        // Validate that the cart items have string IDs
        const validatedCart = parsedCart.filter(
          (item: CartItem) =>
            item && typeof item.id === "string" && item.id.trim() !== ""
        );
        setItems(validatedCart);
      } catch (e) {
        console.error("Failed to parse saved cart", e);
        // Clear invalid cart data
        localStorage.removeItem("restaurant-cart");
      }
    }
  }, []);

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (isClient) {
      if (items.length > 0) {
        localStorage.setItem("restaurant-cart", JSON.stringify(items));
      } else {
        localStorage.removeItem("restaurant-cart");
      }
    }
  }, [items, isClient]);

  const addItem = (newItem: CartItem) => {
    // Validate that the new item has a valid string ID
    if (!newItem.id || typeof newItem.id !== "string") {
      console.error("Cannot add item without valid string ID:", newItem);
      return;
    }

    setItems((prevItems) => {
      const existingItemIndex = prevItems.findIndex(
        (item) => item.id === newItem.id
      );

      if (existingItemIndex > -1) {
        // If item exists, increase quantity
        const updatedItems = [...prevItems];
        updatedItems[existingItemIndex].quantity += newItem.quantity;
        return updatedItems;
      } else {
        // Otherwise add new item
        return [...prevItems, newItem];
      }
    });

    // Open cart when adding items
    setIsCartOpen(true);
  };

  const removeItem = (id: string) => {
    setItems((prevItems) => prevItems.filter((item) => item.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(id);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  const clearCart = () => {
    setItems([]);
    localStorage.removeItem("restaurant-cart");
  };

  const totalItems = items.reduce((total, item) => total + item.quantity, 0);

  const subtotal = items.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        clearCart,
        totalItems,
        subtotal,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
