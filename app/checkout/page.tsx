'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/app/context/CartContext';

export default function CheckoutPage() {
  const { cartItems, totalItems, totalAmount, updateQuantity, removeFromCart } = useCart();
  const [deliveryCharges, setDeliveryCharges] = useState<{ [key: string]: number }>({});
  const [isLoading, setIsLoading] = useState(false);

  const DELIVERY_CHARGE = 100; // 100 RS delivery charge for items under 500 RS
  const FREE_DELIVERY_THRESHOLD = 500;

  useEffect(() => {
    // Calculate delivery charges for each item
    const charges = cartItems.reduce((acc, item) => {
      acc[item.id] = item.price * item.quantity < FREE_DELIVERY_THRESHOLD ? DELIVERY_CHARGE : 0;
      return acc;
    }, {} as { [key: string]: number });
    setDeliveryCharges(charges);
  }, [cartItems]);

  const handleQuantityChange = async (itemId: string, newQuantity: number) => {
    setIsLoading(true);
    try {
      if (newQuantity <= 0) {
        await removeFromCart(itemId);
      } else {
        await updateQuantity(itemId, newQuantity);
      }
    } catch (err) {
      console.error("Error updating cart:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveItem = async (itemId: string) => {
    setIsLoading(true);
    try {
      await removeFromCart(itemId);
    } catch (err) {
      console.error("Error removing item from cart:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-8">Checkout</h1>
      
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Products List - Left Side */}
        <div className="lg:w-2/3">
          {cartItems.length === 0 ? (
            <div className="text-center py-8">
              <p>Your cart is empty</p>
            </div>
          ) : (
            <div className="space-y-4">
              {cartItems.map((item) => (
                <div key={item.id} className="flex flex-col sm:flex-row items-center gap-4 p-4 border rounded-lg shadow-sm">
                  <div className="relative w-24 h-24">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      className="object-cover rounded-md"
                    />
                  </div>
                  
                  <div className="flex-grow flex flex-col sm:flex-row items-center sm:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold">{item.name}</h3>
                      <p className="text-gray-600">Rs. {item.price}</p>
                    </div>
                    
                    <div className="flex items-center justify-center sm:justify-start gap-2">
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        disabled={isLoading}
                      >
                        -
                      </button>
                      <span className="w-8 text-center">{item.quantity}</span>
                      <button
                        onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                        className="px-3 py-1 bg-gray-200 rounded disabled:opacity-50"
                        disabled={isLoading}
                      >
                        +
                      </button>
                    </div>
                    
                    <div className="text-sm">
                      {deliveryCharges[item.id] > 0 ? (
                        <span className="text-orange-600">Delivery: Rs. {deliveryCharges[item.id]}</span>
                      ) : (
                        <span className="text-green-600">Free Delivery</span>
                      )}
                    </div>
                  
                    <button
                      onClick={() => handleRemoveItem(item.id)}
                      className="text-red-500 hover:text-red-700 disabled:opacity-50"
                      disabled={isLoading}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Payment Summary - Right Side */}
        <div className="lg:w-1/3">
          <div className="border rounded-lg p-6 shadow-sm sticky top-4">
            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
            
            <div className="space-y-2 mb-4">
              <div className="flex justify-between">
                <span>Subtotal ({totalItems} items)</span>
                <span>Rs. {totalAmount}</span>
              </div>
              
              <div className="flex justify-between">
                <span>Delivery Charges</span>
                <span>Rs. {Object.values(deliveryCharges).reduce((sum, charge) => sum + charge, 0)}</span>
              </div>
              
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>Rs. {totalAmount + Object.values(deliveryCharges).reduce((sum, charge) => sum + charge, 0)}</span>
                </div>
              </div>
            </div>

            <button
              className={`w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition-colors ${isLoading || cartItems.length === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
              disabled={isLoading || cartItems.length === 0}
            >
              Proceed to Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}