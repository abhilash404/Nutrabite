'use client';
import Link from 'next/link';
import { useCart } from '@/lib/CartContext';
import { useAuth } from '@/lib/AuthContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function Navbar() {
  const { itemCount } = useCart();
  const { user } = useAuth();
  
  return (
    <header className="sticky top-0 z-50 w-full border-b dark:border-neutral-800 bg-white dark:bg-neutral-900 dark:bg-neutral-950 transition-colors duration-300">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-emerald-400 bg-clip-text text-transparent">
            Nutrabite
          </span>
        </Link>
        <nav className="hidden md:flex items-center gap-6">
          <Link href="/kitchens" className="text-sm font-medium hover:text-green-600 transition-colors">
            Kitchens
          </Link>
          <Link href="/menu" className="text-sm font-medium hover:text-green-600 transition-colors">
            Menu
          </Link>
          <Link href="/plans" className="text-sm font-medium hover:text-green-600 transition-colors">
            Meal Plans
          </Link>
          <Link href="/track" className="text-sm font-medium hover:text-green-600 transition-colors">
            Tracker
          </Link>
        </nav>
        <div className="flex items-center gap-4">
          <ThemeToggle />
          <Link href="/cart" className="text-sm font-medium hover:text-green-600 transition-colors relative">
            Cart
            {itemCount > 0 && (
              <span className="absolute -top-2 -right-3 h-[18px] w-[18px] rounded-full bg-green-500 text-[10px] font-bold text-white flex items-center justify-center border-2 border-white shadow-sm">
                {itemCount}
              </span>
            )}
          </Link>
          
          {user ? (
            <Link href="/profile" className="flex items-center hover:opacity-80 transition-opacity">
              <Avatar className="h-10 w-10 border-2 border-white shadow-sm">
                {user.avatarUrl ? (
                  <AvatarImage src={user.avatarUrl} alt={user.name} />
                ) : null}
                <AvatarFallback className="bg-green-100 text-green-700 font-bold">
                  {user.name.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Link href="/signin" className="px-4 py-2 rounded-full bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors shadow-md hover:shadow-lg">
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
