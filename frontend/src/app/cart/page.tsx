'use client';

import { useCart } from "@/lib/CartContext";
import { useAuth } from "@/lib/AuthContext";
import Image from "next/image";
import Link from "next/link";
import API from '@/lib/api';
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, cartTotal, refreshCart } = useCart();
  const { user } = useAuth();
  const router = useRouter();
  
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [paymentStep, setPaymentStep] = useState<'idle' | 'processing' | 'qr' | 'success'>('idle');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleCheckout = async () => {
    if (!user) {
      router.push('/signin');
      return;
    }
    
    setIsCheckingOut(true);
    setPaymentStep('processing');
    setErrorMsg(null);
    
    try {
      // 1. Process Checkout
      const res = await fetch(`${API}/api/checkout/${user.id}/process`, { method: 'POST' });
      if (!res.ok) throw new Error(`Checkout failed (${res.status})`);
      const data = await res.json();
      
      if (!data.success || !data.orderId) throw new Error(data.message || 'Invalid checkout response');

      setOrderId(data.orderId);
      refreshCart(); // Cart is cleared on backend — sync frontend immediately

      // 2. Fetch QR Code
      const qrRes = await fetch(`${API}/api/checkout/${data.orderId}/qr`);
      if (!qrRes.ok) throw new Error(`QR fetch failed (${qrRes.status})`);
      const qrData = await qrRes.json();
      
      if (!qrData.success || !qrData.qrCodeBase64) throw new Error(qrData.message || 'QR generation failed');

      setQrCode(qrData.qrCodeBase64);
      setPaymentStep('qr');
    } catch (e: unknown) {
      console.error('CHECKOUT ERROR:', e);
      const msg = e instanceof Error ? e.message : 'Could not connect to server. Is the backend running?';
      setErrorMsg(msg);
      setPaymentStep('idle');
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleRetryQr = async () => {
    if (!orderId) return;
    setIsCheckingOut(true);
    setErrorMsg(null);
    try {
      const qrRes = await fetch(`${API}/api/checkout/${orderId}/qr`);
      if (!qrRes.ok) throw new Error(`QR fetch failed (${qrRes.status})`);
      const qrData = await qrRes.json();
      if (!qrData.success || !qrData.qrCodeBase64) throw new Error(qrData.message || 'QR generation failed');
      setQrCode(qrData.qrCodeBase64);
      setPaymentStep('qr');
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Could not fetch QR code.';
      setErrorMsg(msg);
    } finally {
      setIsCheckingOut(false);
    }
  };

  const handleSimulatePayment = async () => {
    if (!orderId) return;
    try {
      const res = await fetch(`${API}/api/checkout/${orderId}/confirm`, { method: 'POST' });
      if (!res.ok) throw new Error('Payment confirmation failed');
      const data = await res.json();
      if (data.success) {
        setPaymentStep('success');
      }
    } catch(e) {
      console.error('PAYMENT ERROR:', e);
    }
  };

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Please Sign In</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-8">You must be logged in to view your cart.</p>
        <Link href="/signin" className="px-8 py-3 bg-green-600 text-white font-bold rounded-full hover:bg-green-700 transition-colors">
          Sign In
        </Link>
      </div>
    );
  }

  if (items.length === 0 && paymentStep === 'idle') {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center">
        <div className="text-6xl mb-6">🛒</div>
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">Your cart is empty</h1>
        <p className="text-neutral-500 dark:text-neutral-400 mb-8">Looks like you haven&apos;t added any healthy meals yet.</p>
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
      
      {paymentStep === 'qr' && qrCode ? (
        <div className="max-w-md mx-auto py-12 text-center bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-xl">
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Scan to Pay</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-6">Scan this QR code with any UPI app to complete your order.</p>
          <div className="flex justify-center mb-8">
            <img src={`data:image/png;base64,${qrCode}`} alt="Payment QR Code" className="w-64 h-64 rounded-xl border-4 border-white shadow-sm" />
          </div>
          <button 
            onClick={handleSimulatePayment}
            className="w-full py-3 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition-colors shadow-lg"
          >
            Simulate Payment Scan
          </button>
        </div>
      ) : paymentStep === 'success' ? (
        <div className="max-w-md mx-auto py-12 text-center bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-green-100 shadow-xl">
          <div className="w-20 h-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-4xl mx-auto mb-6">
            ✓
          </div>
          <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">Order Placed Successfully!</h2>
          <p className="text-neutral-500 dark:text-neutral-400 mb-8">Thank you for choosing Nutrabite. Your payment was received.</p>
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
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4">{item.calories} Cal</p>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3 bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-xl">
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white dark:bg-neutral-900 rounded-lg text-neutral-600 font-bold hover:bg-neutral-200 transition-colors shadow-sm"
                      >
                        -
                      </button>
                      <span className="w-8 text-center font-bold text-neutral-900 dark:text-white">{item.quantity}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center bg-white dark:bg-neutral-900 rounded-lg text-neutral-600 font-bold hover:bg-neutral-200 transition-colors shadow-sm"
                      >
                        +
                      </button>
                    </div>
                    <span className="text-xl font-bold text-neutral-900 dark:text-neutral-100">₹{(item.price * item.quantity).toFixed(2)}</span>
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
                  <span>₹{cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Delivery</span>
                  <span className="text-green-600 font-medium">FREE</span>
                </div>
                <div className="flex justify-between text-neutral-600">
                  <span>Tax (5%)</span>
                  <span>₹{(cartTotal * 0.05).toFixed(2)}</span>
                </div>
                <div className="h-px bg-neutral-100 my-4"></div>
                <div className="flex justify-between text-2xl font-extrabold text-neutral-900 dark:text-neutral-100">
                  <span>Total</span>
                  <span>₹{(cartTotal * 1.05).toFixed(2)}</span>
                </div>
              </div>

              {errorMsg && (
                <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-600 text-sm font-medium">
                  <p>⚠️ {errorMsg}</p>
                  {orderId && (
                    <button
                      onClick={handleRetryQr}
                      disabled={isCheckingOut}
                      className="mt-2 text-sm underline text-red-500 hover:text-red-700 disabled:opacity-50"
                    >
                      {isCheckingOut ? 'Retrying...' : 'Retry fetching QR code'}
                    </button>
                  )}
                </div>
              )}

              <button 
                onClick={handleCheckout}
                disabled={isCheckingOut || !!orderId}
                className={`w-full py-4 rounded-2xl font-bold text-white transition-all transform hover:scale-[1.02] shadow-xl ${
                  isCheckingOut || !!orderId
                    ? 'bg-neutral-400 cursor-not-allowed' 
                    : 'bg-green-600 hover:bg-green-700 shadow-green-500/20'
                }`}
              >
                {isCheckingOut ? (
                  <div className="flex items-center justify-center gap-2">
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    {paymentStep === 'processing' ? 'Processing...' : 'Fetching QR...'}
                  </div>
                ) : (
                  'Place Order - QR Pay'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}