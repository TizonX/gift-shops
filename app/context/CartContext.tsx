"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { api } from "@/app/lib/api";
import { useProfile } from "./ProfileContext";

interface CartItem {
  id: string;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

interface CartResponse {
  status: number;
  data: {
    items: Array<{
      product: {
        _id: string;
        title: string;
        price: number;
        stock: number;
        images: string[];
      };
      quantity: number;
      price: number;
      _id: string;
      addedAt: string;
    }>;
    totalAmount: number;
    totalItems: number;
  };
}

interface CartContextType {
  cartItems: CartItem[];
  totalItems: number;
  totalAmount: number;
  addToCart: (item: CartItem) => Promise<void>;
  removeFromCart: (itemId: string) => Promise<void>;
  updateQuantity: (itemId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  refetchCart: () => Promise<void>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [totalItems, setTotalItems] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const { profile } = useProfile();

  const transformCartData = (cartData: CartResponse) => {
    if (!cartData?.data?.items) return [];

    return cartData.data.items.map((item) => ({
      id: item.product._id,
      name: item.product.title,
      price: item.price,
      image: item.product.images[0],
      quantity: item.quantity,
    }));
  };

  const updateCartState = (cartData: CartResponse) => {
    const items = transformCartData(cartData);
    setCartItems(items);
    setTotalItems(cartData.data.totalItems);
    setTotalAmount(cartData.data.totalAmount);
  };

  // Update cart whenever profile changes
  useEffect(() => {
    if (profile?.data?.cart) {
      const items = profile.data.cart.items.map((item) => ({
        id: item.product._id,
        name: item.product.title,
        price: item.price,
        image: item.product.images[0],
        quantity: item.quantity,
      }));
      setCartItems(items);
      setTotalItems(profile.data.cart.totalItems);
      setTotalAmount(profile.data.cart.totalAmount);
    }
  }, [profile]);

  const refetchCart = async () => {
    try {
      const res = await api("/users/cart", {
        method: "GET",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        updateCartState(data);
      }
    } catch (err) {
      console.error("Failed to fetch cart items:", err);
      setCartItems([]);
      setTotalItems(0);
      setTotalAmount(0);
    }
  };

  const addToCart = async (item: CartItem) => {
    try {
      const res = await api("/users/cart", {
        method: "POST",
        credentials: "include",
        body: JSON.stringify({
          productId: item.id,
          quantity: 1,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        updateCartState(data);
      }
    } catch (err) {
      console.error("Failed to add item to cart:", err);
    }
  };

  const removeFromCart = async (productId: string) => {
    try {
      const res = await api(`/users/cart/${productId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (res.ok) {
        const data = await res.json();
        updateCartState(data);
      }
    } catch (err) {
      console.error("Failed to remove item from cart:", err);
    }
  };

  const updateQuantity = async (itemId: string, quantity: number) => {
    try {
      const res = await api(`/users/cart/${itemId}`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify({
          productId: itemId,
          quantity,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        updateCartState(data);
      }
    } catch (err) {
      console.error("Failed to update cart quantity:", err);
    }
  };

  const clearCart = () => {
    setCartItems([]);
    setTotalItems(0);
    setTotalAmount(0);
  };

  return (
    <CartContext.Provider
      value={{
        cartItems,
        totalItems,
        totalAmount,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        refetchCart,
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
