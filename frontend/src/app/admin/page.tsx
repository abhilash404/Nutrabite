'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import API from '@/lib/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'menu' | 'orders'>('menu');
  const [items, setItems] = useState<any[]>([]);

  useEffect(() => {
    fetch(`${API}/api/menu`)
      .then(res => res.json())
      .then(data => setItems(data))
      .catch(err => console.error(err));
  }, []);

  const deleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this item?')) {
      setItems(items.filter(item => item.id !== id));
    }
  };

  const allOrders = [
    { id: 'ORD-7281', user: 'John Doe', items: 'Avocado Toast, Paneer Tikka Wrap', total: 24.50, status: 'Delivered', date: 'Oct 12' },
    { id: 'ORD-8912', user: 'Jane Smith', items: 'Grilled Chicken Salad', total: 12.99, status: 'Preparing', date: 'Today' },
    { id: 'ORD-4432', user: 'Mike Ross', items: 'Vegan Protein Bowl, Bliss Bites', total: 11.98, status: 'Pending', date: 'Just now' },
  ];

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-6">
        <div>
          <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-2">Admin Dashboard</h1>
          <p className="text-neutral-500 dark:text-neutral-400 font-medium">Manage Nutrabite menu and track customer orders.</p>
        </div>
        
        <div className="flex gap-2 p-1 bg-neutral-100 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('menu')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ₹{activeTab === 'menu' ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-md' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700'}`}
          >
            Menu Items
          </button>
          <button 
            onClick={() => setActiveTab('orders')}
            className={`px-6 py-2.5 rounded-xl font-bold transition-all ₹{activeTab === 'orders' ? 'bg-white dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 shadow-md' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700'}`}
          >
            System Orders
          </button>
        </div>
      </div>

      {activeTab === 'menu' ? (
        <div className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-neutral-50 flex justify-between items-center">
            <h2 className="text-xl font-bold text-neutral-800 dark:text-neutral-200">Menu Management</h2>
            <button className="px-4 py-2 bg-green-600 text-white font-bold rounded-xl text-sm hover:bg-green-700 transition-colors">
              + Add New Food
            </button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead>
                <tr className="bg-neutral-50 dark:bg-neutral-950 text-neutral-400 text-[10px] uppercase font-black tracking-widest">
                  <th className="px-6 py-4">Item</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Price</th>
                  <th className="px-6 py-4">Macros</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-50">
                {items.map((item) => (
                  <tr key={item.id} className="hover:bg-neutral-50 dark:bg-neutral-950/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0 border border-neutral-100 dark:border-neutral-800">
                          <Image src={item.image} alt={item.name} fill className="object-cover" />
                        </div>
                        <span className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">{item.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-medium text-neutral-500 dark:text-neutral-400">{item.category}</td>
                    <td className="px-6 py-4 text-sm font-bold text-neutral-900 dark:text-neutral-100">₹{item.price}</td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-1 rounded">
                        {item.calories} CAL
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button className="p-2 text-neutral-400 hover:text-blue-500 transition-colors">
                          ✎
                        </button>
                        <button 
                          onClick={() => deleteItem(item.id)}
                          className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                        >
                          🗑
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {allOrders.map((order) => (
            <div key={order.id} className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex flex-col md:flex-row justify-between items-center gap-6">
              <div className="flex items-center gap-6 w-full md:w-auto">
                <div className="w-12 h-12 bg-neutral-100 rounded-2xl flex items-center justify-center text-xl">
                  📦
                </div>
                <div>
                  <h3 className="font-bold text-neutral-900 dark:text-neutral-100">{order.id} • {order.user}</h3>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 font-medium truncate max-w-[200px]">{order.items}</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between md:justify-end gap-10 w-full md:w-auto">
                <div className="text-right">
                  <p className="text-sm font-bold text-neutral-900 dark:text-neutral-100">₹{order.total}</p>
                  <p className="text-[10px] text-neutral-400 font-bold uppercase">{order.date}</p>
                </div>
                
                <select className="px-4 py-2 bg-neutral-50 dark:bg-neutral-950 border border-neutral-100 dark:border-neutral-800 rounded-xl text-sm font-bold text-neutral-700 cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500">
                  <option value="Pending">Pending</option>
                  <option value="Preparing" selected={order.status === 'Preparing'}>Preparing</option>
                  <option value="Delivered" selected={order.status === 'Delivered'}>Delivered</option>
                </select>
                
                <button className="text-neutral-300 hover:text-neutral-500 dark:text-neutral-400 text-xl font-bold">
                  ⋮
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
