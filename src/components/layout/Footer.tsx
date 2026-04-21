import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-neutral-900 border-t border-neutral-800 text-white py-16">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          <div className="md:col-span-1">
            <Link href="/" className="text-2xl font-black bg-gradient-to-r from-green-500 to-emerald-400 bg-clip-text text-transparent mb-6 block">
              Nutrabite
            </Link>
            <p className="text-neutral-400 text-sm leading-relaxed">
              Premium healthy food delivery. Nutritionist-approved, chef-crafted, and macro-perfect meals for your fitness goals.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Shop</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/menu" className="hover:text-green-500 transition-colors">Full Menu</Link></li>
              <li><Link href="/plans" className="hover:text-green-500 transition-colors">Subscription Plans</Link></li>
              <li><Link href="/menu" className="hover:text-green-500 transition-colors">New Arrivals</Link></li>
              <li><Link href="/menu" className="hover:text-green-500 transition-colors">Veg Only</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Account</h4>
            <ul className="space-y-4 text-sm font-medium">
              <li><Link href="/profile" className="hover:text-green-500 transition-colors">My Profile</Link></li>
              <li><Link href="/track" className="hover:text-green-500 transition-colors">Orders & Tracking</Link></li>
              <li><Link href="/cart" className="hover:text-green-500 transition-colors">Shopping Cart</Link></li>
              <li><Link href="/admin" className="hover:text-amber-500 transition-colors">Admin Portal</Link></li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-widest text-neutral-500 dark:text-neutral-400">Support</h4>
            <ul className="space-y-4 text-sm font-medium text-neutral-400">
              <li>Help Center</li>
              <li>Contact Us</li>
              <li>Privacy Policy</li>
              <li>Terms of Service</li>
            </ul>
          </div>
        </div>
        
        <div className="pt-12 border-t border-neutral-800 flex flex-col md:flex-row justify-between items-center gap-6">
          <p className="text-neutral-500 dark:text-neutral-400 text-xs">© 2024 Nutrabite Inc. All rights reserved.</p>
          <div className="flex gap-6 text-neutral-400">
            {/* Social Svg Placeholders */}
            <span className="hover:text-white cursor-pointer transition-colors">Instagram</span>
            <span className="hover:text-white cursor-pointer transition-colors">Twitter</span>
            <span className="hover:text-white cursor-pointer transition-colors">Facebook</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
