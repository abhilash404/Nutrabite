'use client';

import { Check } from 'lucide-react';

export default function PlansPage() {
  const plans = [
    {
      name: "Weekly Kickstart",
      price: "49.99",
      duration: "Week",
      features: ["5 Lunch Meals", "Nutrition Consulting", "Free Delivery", "Pause Anytime"],
      color: "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800",
      btnColor: "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/30",
      popular: false
    },
    {
      name: "Monthly Fuel",
      price: "179.99",
      duration: "Month",
      features: ["20 Lunch Meals", "Weekly Body Analysis", "Priority Delivery", "Custom Macros", "10% Off Snacks"],
      color: "bg-green-50 dark:bg-neutral-900 border-green-200 dark:border-neutral-800",
      btnColor: "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/30",
      popular: true
    },
    {
      name: "Total Transformation",
      price: "299.99",
      duration: "Month",
      features: ["40 Meals (Lunch & Dinner)", "Dedicated Nutritionist", "Vip Support", "Monthly Goal Tracking", "Free Snack Box"],
      color: "bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-800",
      btnColor: "bg-green-600 hover:bg-green-700 shadow-lg shadow-green-500/30",
      popular: false
    }
  ];

  return (
    <div className="container mx-auto px-4 py-16">

      {/* Heading */}
      <div className="text-center mb-16">
        <h1 className="text-5xl font-black text-neutral-900 dark:text-neutral-100 mb-4 tracking-tighter">
          Meal Subscriptions
        </h1>
        <p className="text-neutral-500 dark:text-neutral-400 max-w-2xl mx-auto text-lg">
          Save time and money with our nutritionist-approved meal plans tailored to your fitness journey.
        </p>
      </div>

      {/* Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {plans.map((plan, idx) => (
          <div
            key={idx}
            className={`relative p-8 rounded-[40px] border transition-all hover:shadow-2xl hover:-translate-y-2 flex flex-col ${plan.color}`}
          >

            {/* Popular Badge */}
            {plan.popular && (
              <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 px-4 py-1.5 bg-green-600 text-white text-xs font-black uppercase tracking-widest rounded-full shadow-lg">
                Most Popular
              </div>
            )}

            {/* Title */}
            <div className="mb-8">
              <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-2">
                {plan.name}
              </h2>
              <div className="flex items-baseline gap-1">
                <span className="text-4xl font-black text-neutral-900 dark:text-neutral-100">
                  ₹{plan.price}
                </span>
                <span className="text-neutral-400 font-bold">
                  / {plan.duration}
                </span>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-4 mb-10 flex-grow">
              {plan.features.map((feature, fIdx) => (
                <div key={fIdx} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-green-100 text-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3" />
                  </div>
                  <span className="text-neutral-600 dark:text-neutral-300 font-medium text-sm">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Button */}
            <button
              className={`w-full py-4 rounded-2xl text-white font-bold transition-all 
              hover:scale-[1.05] active:scale-95 ${plan.btnColor}`}
            >
              Subscribe Now
            </button>

          </div>
        ))}
      </div>

      {/* Bottom Section */}
      <div className="mt-24 bg-neutral-900 rounded-[50px] p-12 text-center text-white overflow-hidden relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-green-500/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
        <div className="relative z-10">
          <h2 className="text-3xl font-bold mb-4">
            Need a Custom Enterprise Plan?
          </h2>
          <p className="text-neutral-400 mb-8 max-w-xl mx-auto">
            We provide corporate wellness meal solutions for offices. Contact our team for a bulk quote.
          </p>
          <button className="px-10 py-4 bg-green-600 rounded-full hover:bg-green-700 font-bold">
            Get in Touch
          </button>
        </div>
      </div>

    </div>
  );
}