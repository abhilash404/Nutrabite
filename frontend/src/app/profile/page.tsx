'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/AuthContext';
import API from '@/lib/api';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  LineChart, Line, CartesianGrid,
  ComposedChart
} from 'recharts';

export default function ProfilePage() {
  const router = useRouter();
  const { user, logout } = useAuth();
  
  const [profile, setProfile] = useState({
    name: '',
    age: 28,
    weight: 75,
    height: 175,
    goal: 'Weight Loss'
  });
  
  const [stats, setStats] = useState({
    bmi: 0,
    dailyCalories: 0,
    status: ''
  });

  const [isSaving, setIsSaving] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [graphData, setGraphData] = useState<any>(null);

  useEffect(() => {
    if (!user) {
      router.push('/login');
      return;
    }
    
    setProfile(p => ({...p, name: user.name}));
    
    fetch(`${API}/api/auth/${user.id}/stats`)
      .then(res => res.json())
      .then(data => {
        if (data.success) setGraphData(data);
      })
      .catch(err => console.error("Failed to load stats", err));
      
  }, [user, router]);

  const calculateStats = (p: typeof profile) => {
    const heightM = p.height / 100;
    const bmi = p.weight / (heightM * heightM);
    
    let bmr = 10 * p.weight + 6.25 * p.height - 5 * p.age + 5;
    let tdee = bmr * 1.5; 
    
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

  useEffect(() => {
    calculateStats(profile);
  }, [profile.weight, profile.height, profile.age, profile.goal]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    setShowSuccess(false);
    await new Promise(resolve => setTimeout(resolve, 800));
    calculateStats(profile);
    setIsSaving(false);
    setShowSuccess(true);
    setTimeout(() => setShowSuccess(false), 3000);
  };
  
  const handleSignOut = () => {
    logout();
    router.push('/login');
  };

  if (!user) return null;

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <div className="flex justify-between items-center mb-10">
        <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-neutral-100">Your Health Profile</h1>
        <button 
          onClick={handleSignOut}
          className="px-6 py-2.5 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 font-bold rounded-xl hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
        >
          Sign Out
        </button>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 mb-10">
        <div className="lg:col-span-2">
          <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm h-full">
            <h2 className="text-2xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Personal Details</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 ml-1">Full Name</label>
                  <input 
                    type="text" 
                    value={profile.name} 
                    onChange={(e) => setProfile({...profile, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium bg-transparent dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 ml-1">Age</label>
                  <input 
                    type="number" 
                    value={profile.age} 
                    onChange={(e) => setProfile({...profile, age: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium bg-transparent dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 ml-1">Weight (kg)</label>
                  <input 
                    type="number" 
                    value={profile.weight} 
                    onChange={(e) => setProfile({...profile, weight: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium bg-transparent dark:text-white"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 ml-1">Height (cm)</label>
                  <input 
                    type="number" 
                    value={profile.height} 
                    onChange={(e) => setProfile({...profile, height: parseInt(e.target.value) || 0})}
                    className="w-full px-4 py-3 rounded-xl border border-neutral-200 dark:border-neutral-700 focus:outline-none focus:ring-2 focus:ring-green-500 transition-all font-medium bg-transparent dark:text-white"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <label className="text-sm font-bold text-neutral-700 dark:text-neutral-300 ml-1">Fitness Goal</label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {['Weight Loss', 'Maintenance', 'Muscle Gain'].map((goal) => (
                    <button
                      key={goal}
                      type="button"
                      onClick={() => setProfile({...profile, goal: goal as any})}
                      className={`py-3 px-4 rounded-xl border font-bold transition-all ${
                        profile.goal === goal 
                          ? 'bg-green-600 border-green-600 text-white shadow-lg shadow-green-600/20' 
                          : 'bg-white dark:bg-neutral-900 border-neutral-200 dark:border-neutral-700 text-neutral-600 dark:text-neutral-400 hover:border-green-300'
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
                className={`w-full py-4 font-bold rounded-2xl transition-all shadow-xl mt-4 flex items-center justify-center gap-2 ${
                  showSuccess ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-neutral-900 dark:bg-neutral-100 text-white dark:text-neutral-900 hover:bg-neutral-800 dark:hover:bg-white'
                } ${isSaving ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isSaving ? 'Updating Profile...' : showSuccess ? 'Successfully Updated!' : 'Save & Update Calculations'}
              </button>
            </form>
          </div>
        </div>

        <div className="lg:col-span-1 space-y-6">
          <div className="bg-gradient-to-br from-green-600 to-emerald-700 p-8 rounded-3xl text-white shadow-xl shadow-green-600/20 h-full flex flex-col justify-center">
            <h2 className="text-xl font-bold mb-6 opacity-90 underline decoration-green-300/30 underline-offset-8">Nutritional Insights</h2>
            <div className="space-y-8">
              <div>
                <p className="text-sm font-medium opacity-80 mb-1 tracking-wider uppercase">Your BMI Score</p>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black">{stats.bmi}</span>
                  <span className="text-lg font-bold pb-1 text-green-200">{stats.status}</span>
                </div>
              </div>
              <div className="h-px bg-white/20"></div>
              <div>
                <p className="text-sm font-medium opacity-80 mb-1 tracking-wider uppercase">Suggested Daily Intake</p>
                <div className="flex items-end gap-3">
                  <span className="text-5xl font-black">{stats.dailyCalories}</span>
                  <span className="text-lg font-bold pb-1 text-green-200">kcal / day</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {graphData && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
            <h3 className="text-lg font-bold mb-6 text-neutral-900 dark:text-neutral-100">Calories Consumed (7 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={graphData.calorieData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar dataKey="consumed" fill="#3b82f6" name="Consumed (kcal)" radius={[4, 4, 0, 0]} />
                <Line type="monotone" dataKey="limit" stroke="#ef4444" strokeWidth={2} name="Limit" dot={false} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
            <h3 className="text-lg font-bold mb-6 text-neutral-900 dark:text-neutral-100">Macro Breakdown (7 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie data={graphData.macroData} dataKey="value" nameKey="name" cx="50%" cy="50%" innerRadius={60} outerRadius={80} label>
                  {graphData.macroData.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
            <h3 className="text-lg font-bold mb-6 text-neutral-900 dark:text-neutral-100">Weight Trend (7 Days)</h3>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={graphData.weightData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis domain={['dataMin - 1', 'dataMax + 1']} stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Line type="monotone" dataKey="weight" stroke="#10b981" strokeWidth={3} dot={{r: 4, fill: '#10b981'}} name="Weight (kg)" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
            <h3 className="text-lg font-bold mb-6 text-neutral-900 dark:text-neutral-100">Activity & Workouts</h3>
            <ResponsiveContainer width="100%" height={250}>
              <ComposedChart data={graphData.activityData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                <XAxis dataKey="day" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="left" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis yAxisId="right" orientation="right" stroke="#888888" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                <Bar yAxisId="left" dataKey="steps" fill="#8b5cf6" name="Steps" radius={[4, 4, 0, 0]} />
                <Line yAxisId="right" type="monotone" dataKey="workout" stroke="#ec4899" strokeWidth={3} name="Workout (mins)" dot={{r: 4, fill: '#ec4899'}} />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
}