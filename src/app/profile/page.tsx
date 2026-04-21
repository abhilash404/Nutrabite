'use client';

import { useState } from 'react';
import { mockUserProfile } from '@/lib/mockData';

export default function ProfilePage() {
  const [profile, setProfile] = useState(mockUserProfile);
  const [stats, setStats] = useState({
    bmi: 0,
    dailyCalories: 0,
    status: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const calculateStats = (p: typeof mockUserProfile) => {
    // Height in meters
    const heightM = p.height / 100;
    const bmi = p.weight / (heightM * heightM);
    
    // Simple BMR estimation (Mifflin-St Jeor)
    let bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + 5;
    let tdee = bmr * 1.5; // Moderate activity level
    
    let targetCal = tdee;
    if (p.goal === 'Weight Loss') targetCal -= 500;
    if (p.goal === 'Muscle Gain') targetCal += 300;

    let status = '';
    if (bmi < 18.5) status = 'Underweight';
    else if (bmi < 25) status = 'Healthy weight';
    else if (bmi < 30) status = 'Overweight';
    else status = 'Obese';

    setStats({
      bmi: parseFloat(bmi.toFixed(1)),
      dailyCalories: Math.round(targetCal),
      status
    });
  };

  // Run on mount
  useState(() => {
    calculateStats(profile);
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setShowSuccess(false);

    // Simulate network latency
    await new Promise(resolve => setTimeout(resolve, 800));

    calculateStats(profile);
    setIsSaving(false);
    setShowSuccess(true);
    
    // Hide success message after 3 seconds
    setTimeout(() => {
      setShowSuccess(false);
    }, 3000);
  };

  return (
    <div className="container mx-auto px-4 py-12 max-w-5xl">
      <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-10">Your Fitness Profile</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        {/* Form */}
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Personal Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={profile.name} 
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700 ml-1">Age</label>
                  <input 
                    type="number" 
                    value={profile.age} 
                    onChange={(e) => setProfile({...profile, age: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700 ml-1">Weight (kg)</label>
                  <input 
                    type="number" 
                    value={profile.weight} 
                    onChange={(e) => setProfile({...profile, weight: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700 ml-1">Height (cm)</label>
                  <input 
                    type="number" 
                    value={profile.height} 
                    onChange={(e) => setProfile({...profile, height: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700 ml-1">Fitness Goal</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {['Weight Loss', 'Maintenance', 'Muscle Gain'].map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setProfile({...profile, goal: goal as any})}
                      className={`py-3 px-4 rounded-xl border font-bold transition-all ₹{
                        profile.goal === goal 
                          ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-600/20' 
                          : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 hover:border-green-300'
                      }`}
                    >
                      {goal}
                    </button>
                  ))}
                </div>
              </div>

              <button 
                type="submit" 
                disabled={isSaving}
                className={`w-full py-4 font-bold rounded-2xl transition-all shadow-xl mt-4 flex items-center justify-center gap-2 ₹{
                  showSuccess ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-neutral-900 text-white hover:bg-neutral-800'
                } ₹{isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Updating Profile...
                  </>
                ) : showSuccess ? (
                  <>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    Successfully Updated!
                  </>
                ) : (
                  'Save & Update Calculations'
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Results Card */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-8 rounded-3xl text-white shadow-xl shadow-green-600/20">
            <h2 className="text-xl font-bold mb-6 opacity-90 underline decoration-green-300/30 underline-offset-8">Nutritional Insights</h2>
            
            <div className="space-y-8">
              <div>
                <p className="text-sm font-medium opacity-80 mb-1 caps tracking-wider uppercase">Your BMI Score</p>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black">{stats.bmi}</span>
                  <span className="text-lg font-bold pb-1 text-green-200">{stats.status}</span>
                </div>
              </div>

              <div className="h-px bg-white dark:bg-neutral-900/20"></div>

              <div>
                <p className="text-sm font-medium opacity-80 mb-1 caps tracking-wider uppercase">Suggested Daily Intake</p>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black">{stats.dailyCalories}</span>
                  <span className="text-lg font-bold pb-1 text-green-200">kcal / day</span>
                </div>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-white/10 text-sm italic opacity-70">
              *Calculated based on your body metrics and moderate physical activity levels.
            </div>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-100 rounded-2xl flex items-center justify-center text-2xl">
              💡
            </div>
            <div>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-tight">Pro Tip</p>
              <p className="text-sm font-bold text-neutral-800 dark:text-neutral-200">Hydrate well! Drink at least 3L of water daily.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
