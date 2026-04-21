'use client';

import { useCart } from "@/lib/CartContext";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal, clearCart } = useCart();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'processing' | 'success'>('idle');

  const handleCheckout = () => {
    setIsCheckingOut(true);
    setPaymentStep('processing');
    
    // Simulate Razorpay Payment Flow
    setTimeout(() => {
      setPaymentStep('success');
      setTimeout(() => {
        clearCart();
        setIsCheckingOut(false);
        setPaymentStep('idle');
      }, 2000);
    }, 2000);
  };

  if (items.length === 0 && paymentStep !== 'success') {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Your cart is empty</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-8">Looks like you haven't added any healthy meals yet.</p>
        <Link 
          href="/menu" 
          className="px-8 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-colors"
        >
          Browse Menu
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-10">Your Cart</h1>
      
      {paymentStep === 'success' ? (
        <div className="max-w-md mx-auto py-12 text-center bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-green-100 shadow-xl animate-in fade-in zoom-in duration-500">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Order Placed Successfully!</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">Thank you for choosing Nutrabite. Your healthy meal is on its way!</p>
          <Link 
            href="/track" 
            className="block w-full py-3 bg-neutral-900 text-white font-bold rounded-xl hover:bg-neutral-800 transition-colors shadow-lg"
          >
            Track Order
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            {items.map((item) => (
              <div key={item.id} className="flex flex-col sm:flex-row gap-6 bg-white dark:bg-neutral-900 p-6 rounded-2xl border border-neutral-100 dark:border-neutral-800 shadow-sm hover:shadow-md transition-shadow">
                <div className="relative w-full sm:w-32 h-32 flex-shrink-0">
                  <Image 
                    src={item.image} 
                    alt={item.name} 
                    fill 
                    className="object-cover rounded-xl" 
                  />
                </div>
                <div className="flex-grow flex flex-col justify-between">
                  <div>
                    <div className="flex justify-between items-start mb-1">
                      <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100">{item.name}</h3>
                      <button 
                        onClick={() => removeFromCart(item.id)}
                        className="text-neutral-400 hover:text-red-500 transition-colors p-1"
                      >
                        ✕
                      </button>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">{item.type} • {item.calories} Cal</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 bg-neutral-100 p-1.5 rounded-xl">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white dark:bg-neutral-900 rounded-lg text-neutral-600 font-bold hover:bg-neutral-200 transition-colors shadow-sm"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-neutral-900 dark:text-neutral-100">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white dark:bg-neutral-900 rounded-lg text-neutral-600 font-bold hover:bg-neutral-200 transition-colors shadow-sm"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">₹{(item.price * item.quantity)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm sticky top-24">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Order Summary</h2>
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-neutral-600">
                  <span>Subtotal</span>
                  <span>₹{cartTotal}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Tax (5%)</span>
                  <span>₹{(cartTotal * 0.05)}</span>
                </div>
                <div className="h-px bg-neutral-100 my-4"></div>
                <div className="flex justify-between text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">
                  <span>Total</span>
                  <span>₹{(cartTotal * 1.05)}</span>
                </div>
              </div>

              <button 
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className={`w-full py-4 rounded-2xl font-bold text-white transition-all transform hover:scale-[1.02] shadow-xl ₹{
                  isCheckingOut 
                    ? 'bg-neutral-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 shadow-green-500/20'
                }`}
              >
                {isCheckingOut ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    {paymentStep === 'processing' ? 'Processing Payment...' : 'Verifying...'}
                  </div>
                ) : (
                  'Place Order - Razorpay'
                )}
              </button>
              
              <p className="text-[10px] text-center text-neutral-400 mt-6 uppercase tracking-widest font-bold">
                Secure Checkout with Razorpay
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
