'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import Link from 'next/link';

export default function SignInPage() {
  const router = useRouter();
  const { login } = useAuth();
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      name: formData.name,
      email: formData.email,
      phone: formData.phone,
      avatarUrl: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(formData.name)}&backgroundColor=059669`, // fallback avatar using initials
    });
    router.push('/profile');
  };

  const handleGoogleSignIn = () => {
    // Mocking a Google Sign In
    login({
      name: 'Google User',
      email: 'user@gmail.com',
      phone: '123-456-7890',
      avatarUrl: 'https://api.dicebear.com/7.x/initials/svg?seed=GU&backgroundColor=ea4335',
    });
    router.push('/profile');
  };

  return (
    <div className="flex min-h-[calc(100vh-64px)] items-center justify-center p-4">
      <div className="w-full max-w-md bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-neutral-900 dark:text-neutral-100 tracking-tight">Welcome Back</h1>
          <p className="text-neutral-500 dark:text-neutral-400 mt-2">Sign in to your Nutrabite account</p>
        </div>

        <button 
          onClick={handleGoogleSignIn}
          className="w-full mb-6 py-3.5 px-4 rounded-xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:bg-neutral-950 hover:shadow-sm transition-all flex items-center justify-center gap-3 font-bold text-neutral-700"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div className="relative mb-6">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-neutral-200 dark:border-neutral-700"></div>
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-3 bg-white dark:bg-neutral-900 text-neutral-400 font-medium">Or continue with email</span>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-700 ml-1">Full Name</label>
            <input 
              type="text" 
              required
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium"
              placeholder="John Doe"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-700 ml-1">Email Address</label>
            <input 
              type="email" 
              required
              value={formData.email}
              onChange={(e) => setFormData({...formData, email: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium"
              placeholder="john@example.com"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-bold text-neutral-700 ml-1">Phone Number</label>
            <input 
              type="tel" 
              required
              value={formData.phone}
              onChange={(e) => setFormData({...formData, phone: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium"
              placeholder="+1 234 567 8900"
            />
          </div>

          <button 
            type="submit" 
            className="w-full py-4 bg-neutral-900 text-white font-bold rounded-2xl hover:bg-neutral-800 transition-all shadow-xl mt-6"
          >
            Sign In to Account
          </button>
        </form>

        <p className="text-center text-neutral-500 dark:text-neutral-400 text-sm font-medium mt-8">
          By signing in, you agree to our <Link href="#" className="text-green-600 hover:underline">Terms of Service</Link> & <Link href="#" className="text-green-600 hover:underline">Privacy Policy</Link>.
        </p>
      </div>
    </div>
  );
}
