'use client';
import { useState, useEffect } from "react";
import { FoodCategory } from "@/lib/mockData";
import { useCart } from "@/lib/CartContext";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, ShoppingBag, Info, Search } from "lucide-react";

export default function MenuPage() {
  const { addToCart } = useCart();
  const categories: FoodCategory[] = ['Breakfast', 'Lunch', 'Dinner', 'Snacks'];

  const [foodItems, setFoodItems] = useState<any[]>([]);
  const [aiRecommendation, setAiRecommendation] = useState<any>(null);

  useEffect(() => {
    fetch('http://127.0.0.1:5000/api/menu')
      .then(res => res.json())
      .then(data => {
        setFoodItems(data);
        if (data.length > 2) {
          setAiRecommendation(data[2]);
        }
      })
      .catch(err => console.error(err));
  }, []);

  if (!foodItems.length || !aiRecommendation) {
    return <div className="container mx-auto px-4 py-12 text-center">Loading menu...</div>;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      {/* AI Recommendation Banner */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 p-8 rounded-[40px] bg-gradient-to-r from-neutral-900 to-neutral-800 text-white relative overflow-hidden shadow-2xl"
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="text-green-400 w-5 h-5" />
              <span className="text-xs font-black uppercase tracking-widest text-green-400">AI Daily Recommendation</span>
            </div>
            <h2 className="text-4xl font-black mb-4 leading-tight">Based on your goals, we suggest the {aiRecommendation.name}</h2>
            <p className="text-neutral-400 mb-8 max-w-lg">This meal is packed with {aiRecommendation.protein}g of protein and fits perfectly into your weight loss plan while keeping you energized.</p>
            <button 
              onClick={() => addToCart(aiRecommendation)}
              className="px-8 py-4 bg-green-500 hover:bg-green-600 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-green-500/20 active:scale-95"
            >
              <ShoppingBag className="w-5 h-5" />
              Add to Cart - ₹{aiRecommendation.price}
            </button>
          </div>
          <div className="relative w-full md:w-72 h-72 rounded-[30px] overflow-hidden border-4 border-white/5 shadow-2xl">
            <Image src={aiRecommendation.image} alt="AI Pick" fill className="object-cover" />
          </div>
        </div>
      </motion.div>

      <div className="flex flex-col md:flex-row justify-between items-end mb-12 border-b border-neutral-200 dark:border-neutral-700 pb-10">
        <div>
          <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-2">Our Menu</h1>
          <p className="text-neutral-500 dark:text-neutral-400 text-lg">Freshly prepared, macro-balanced meals for every goal.</p>
        </div>
        <div className="mt-6 md:mt-0">
          <input 
            type="search" 
            placeholder="Search meals..." 
            className="w-full md:w-64 px-4 py-2 rounded-full border border-neutral-300 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
          />
        </div>
      </div>

      {categories.map((category) => {
        const items = foodItems.filter(item => item.category === category);
        if (items.length === 0) return null;

        return (
          <div key={category} className="mb-16">
            <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-200 mb-6 flex items-center gap-2">
              {category}
              <span className="text-sm font-normal text-neutral-400 bg-neutral-100 px-2 rounded-full">
                {items.length}
              </span>
            </h2>
            <motion.div 
              layout
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
            >
              {items.map((item, i) => (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={item.id} 
                  className="group bg-white dark:bg-neutral-900 rounded-[32px] overflow-hidden shadow-sm hover:shadow-2xl transition-all duration-500 border border-neutral-100 dark:border-neutral-800 flex flex-col h-full transform hover:-translate-y-2 hover:border-green-100/50"
                >
                  <div className="relative h-48 w-full overflow-hidden">
                    <Image 
                      src={item.image} 
                      alt={item.name} 
                      fill 
                      className="object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    <div className="absolute top-3 left-3 flex gap-2">
                      <span className={`px-2 py-1 text-xs font-bold rounded shadow-sm ₹{
                        item.type === 'Vegan' ? 'bg-green-100 text-green-700' : 
                        item.type === 'Veg' ? 'bg-emerald-100 text-emerald-700' : 
                        'bg-red-100 text-red-700'
                      }`}>
                        {item.type}
                      </span>
                      {item.isPopular && (
                        <span className="bg-amber-100 text-amber-700 px-2 py-1 text-xs font-bold rounded shadow-sm flex items-center gap-1">
                          ★ Popular
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-grow">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-neutral-900 dark:text-neutral-100 group-hover:text-green-600 transition-colors line-clamp-2">{item.name}</h3>
                      <span className="text-lg font-bold text-green-600">₹{item.price}</span>
                    </div>
                    <p className="text-sm text-neutral-500 dark:text-neutral-400 mb-4 line-clamp-2 flex-grow">{item.description}</p>
                    
                    <div className="flex justify-between items-center text-xs text-neutral-600 bg-neutral-50 dark:bg-neutral-950 p-2 rounded-lg mb-4">
                      <div className="flex flex-col items-center">
                        <span className="font-semibold">{item.calories}</span>
                        <span className="text-[10px] uppercase">Cal</span>
                      </div>
                      <div className="w-px h-6 bg-neutral-200"></div>
                      <div className="flex flex-col items-center leading-tight">
                        <span className="font-semibold">{item.protein}g</span>
                        <span className="text-[10px] uppercase">Pro</span>
                      </div>
                      <div className="w-px h-6 bg-neutral-200"></div>
                      <div className="flex flex-col items-center leading-tight">
                        <span className="font-semibold">{item.carbs}g</span>
                        <span className="text-[10px] uppercase">Carbs</span>
                      </div>
                      <div className="w-px h-6 bg-neutral-200"></div>
                      <div className="flex flex-col items-center leading-tight">
                        <span className="font-semibold">{item.fat}g</span>
                        <span className="text-[10px] uppercase">Fat</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => addToCart(item)}
                      className="w-full py-2.5 bg-neutral-900 hover:bg-green-600 text-white font-medium rounded-xl transition-colors mt-auto flex items-center justify-center gap-2"
                    >
                      Add to Cart
                    </button>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}
