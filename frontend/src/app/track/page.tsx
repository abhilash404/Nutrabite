'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useAuth } from '@/lib/AuthContext';

export default function TrackerPage() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<'orders' | 'nutrition'>('nutrition');

  // Interactive Calorie Tracker State
  const [targetCalories, setTargetCalories] = useState(2000);
  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const budget = 500; // in INR
  
  // Custom Activity State
  const [steps, setSteps] = useState(0);
  const [workoutMins, setWorkoutMins] = useState(0);
  const [newSteps, setNewSteps] = useState('');
  const [newWorkout, setNewWorkout] = useState('');

  // Daily consumed tracking
  const [consumedMeals, setConsumedMeals] = useState<any[]>([]);

  // AI Meal Parsing (NLP Input)
  const [aiInput, setAiInput] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [parsedDraft, setParsedDraft] = useState<any>(null);

  const analyzeFoodStr = async () => {
    if (!aiInput.trim()) return;
    setIsAnalyzing(true);
    setParsedDraft(null);

    try {
      const res = await fetch('http://127.0.0.1:5000/api/ai-parse-food', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: aiInput })
      });
      const json = await res.json();
      if (json.success) {
        setParsedDraft(json.data);
      } else {
        alert(json.message);
      }
    } catch (e) {
      console.error(e);
      alert('Failed to analyze food.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const commitParsedFood = () => {
    if (!parsedDraft) return;

    const newLog = {
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      mealType: 'Snacks',
      meal: {
        name: parsedDraft.name,
        calories: parsedDraft.calories,
        protein: parsedDraft.protein,
        carbs: parsedDraft.carbs,
        fat: parsedDraft.fats,
        price: 0,
        portion: parsedDraft.portion,
        image: 'https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800&q=80'
      }
    };
    
    setConsumedMeals(prev => [...prev, newLog]);
    setParsedDraft(null);
    setAiInput('');
  };

  // Expandable Timetable states
  const [expandedLogs, setExpandedLogs] = useState<number[]>([]);
  const toggleExpandLog = (idx: number) => {
    if (expandedLogs.includes(idx)) {
      setExpandedLogs(expandedLogs.filter(i => i !== idx));
    } else {
      setExpandedLogs([...expandedLogs, idx]);
    }
  };

  // AI Recommendation State
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiRecommendations, setAiRecommendations] = useState<any[]>([]);
  const [currentRecIndex, setCurrentRecIndex] = useState(0);
  const [selectedMealType, setSelectedMealType] = useState('Breakfast');

  const handleGetRecommendation = async () => {
    setIsAiLoading(true);
    try {
      const response = await fetch('http://127.0.0.1:5000/api/ai-recommend', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          remainingCalories: Math.max(caloriesRemaining, 0),
          budgetInPaise: budget,
          preference: 'Non-veg',
          mealType: selectedMealType
        })
      });
      const data = await response.json();
      if (data.success) {
        setAiRecommendations(data.recommendations || []);
        setCurrentRecIndex(0);
      } else {
        alert(data.message);
      }
    } catch (e) {
      console.error(e);
    }
    setIsAiLoading(false);
  };

  const logAiMeal = () => {
    if (aiRecommendations.length === 0) return;
    const currentRec = aiRecommendations[currentRecIndex];
    setConsumedMeals(prev => [
      ...prev, 
      ...currentRec.items.map((item: any) => ({
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        meal: item,
        mealType: selectedMealType
      }))
    ]);
    setAiRecommendations([]);
  };

  const logActivity = () => {
    if (newSteps) setSteps(prev => prev + parseInt(newSteps || '0'));
    if (newWorkout) setWorkoutMins(prev => prev + parseInt(newWorkout || '0'));
    setNewSteps('');
    setNewWorkout('');
  };

  const consumedCalories = consumedMeals.reduce((acc, log) => acc + log.meal.calories, 0) + 650; // +650 existing base 
  const caloriesRemaining = targetCalories - consumedCalories;
  const progressPercentage = Math.min((consumedCalories / targetCalories) * 100, 100);

  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    if (user?.id) {
      fetch(`http://127.0.0.1:5000/api/checkout/${user.id}/orders`)
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            setOrders(data.orders);
          }
        })
        .catch(err => console.error(err));
    }
  }, [user]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-6xl">
      <h1 className="text-4xl font-extrabold text-neutral-900 dark:text-neutral-100 mb-8">Detailed Wellness Dashboard</h1>

      <div className="flex gap-2 p-1 bg-neutral-100 dark:bg-neutral-900 border dark:border-neutral-800 rounded-2xl mb-10 w-fit">
        <button onClick={() => setActiveTab('nutrition')} className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'nutrition' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-md border dark:border-neutral-700' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'}`}>
          Daily Nutrition & Activity
        </button>
        <button onClick={() => setActiveTab('orders')} className={`px-6 py-2.5 rounded-xl font-bold transition-all ${activeTab === 'orders' ? 'bg-white dark:bg-neutral-800 text-neutral-900 dark:text-neutral-100 shadow-md border dark:border-neutral-700' : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-300'}`}>
          My Orders
        </button>
      </div>

      {activeTab === 'nutrition' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* LEFT COLUMN: Trackers */}
          <div className="lg:col-span-1 space-y-8">
            
            {/* Calorie Stats Card */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm relative overflow-hidden group">
              <h3 className="text-sm uppercase tracking-wider font-bold text-neutral-400 mb-4">Calorie Intake</h3>
              <div className="flex justify-between items-end mb-2">
                <span className="text-4xl font-black text-neutral-900 dark:text-neutral-100">{consumedCalories}</span>
                {isEditingTarget ? (
                  <input 
                    type="number" 
                    value={targetCalories} 
                    onChange={e => setTargetCalories(parseInt(e.target.value) || 0)}
                    onBlur={() => setIsEditingTarget(false)}
                    autoFocus
                    className="w-20 text-right font-bold text-neutral-400 focus:outline-none border-b border-green-500"
                  />
                ) : (
                  <span onClick={() => setIsEditingTarget(true)} className="text-sm text-neutral-400 font-bold cursor-pointer hover:text-green-600 transition-colors">
                    / {targetCalories} kcal ✎
                  </span>
                )}
              </div>
              
              <div className="h-4 w-full bg-neutral-100 rounded-full overflow-hidden mt-4">
                <div className={`h-full rounded-full transition-all duration-1000 ${progressPercentage > 100 ? 'bg-red-500' : 'bg-green-500'}`} style={{ width: `${progressPercentage}%` }} />
              </div>

              <div className="mt-4 pt-4 border-t border-neutral-100 dark:border-neutral-800 flex justify-between items-center text-sm font-bold">
                <span className="text-neutral-500 dark:text-neutral-400">Remaining Limit:</span>
                <span className={caloriesRemaining > 0 ? "text-green-600" : "text-red-500"}>
                  {caloriesRemaining > 0 ? `${caloriesRemaining} kcal` : 'OVER TARGET!'}
                </span>
              </div>
            </div>

            {/* Smart NLP Food Input Layer */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
              <h3 className="text-sm uppercase tracking-wider font-bold text-neutral-400 mb-4 flex items-center gap-2">🎙️ AI Food Logger</h3>
              
              {!parsedDraft ? (
                <div className="space-y-4">
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="e.g., 2 eggs omelette, chicken biryani" 
                      value={aiInput} 
                      onChange={e=>setAiInput(e.target.value)} 
                      onKeyDown={(e) => e.key === 'Enter' && analyzeFoodStr()}
                      className="w-full px-4 py-3 pr-10 bg-neutral-50 dark:bg-neutral-950 rounded-xl text-sm font-bold border border-transparent focus:border-green-500 focus:outline-none" 
                    />
                    {isAnalyzing && (
                      <div className="absolute right-3 top-3 w-4 h-4 border-2 border-green-500 border-t-transparent rounded-full animate-spin"></div>
                    )}
                  </div>
                  <button 
                    onClick={analyzeFoodStr} 
                    disabled={!aiInput || isAnalyzing} 
                    className="w-full py-3 bg-neutral-900 text-white rounded-xl text-sm font-bold shadow-lg hover:bg-neutral-800 transition-all active:scale-[0.98] disabled:opacity-50 disabled:active:scale-100 disabled:cursor-not-allowed"
                  >
                    Analyze Macros
                  </button>
                </div>
              ) : (
                <div className="space-y-4 bg-green-50 p-4 rounded-2xl border border-green-100 animate-in fade-in slide-in-from-bottom-2">
                   <div className="flex justify-between items-start">
                     <div>
                       <input 
                         type="text" 
                         value={parsedDraft.name} 
                         onChange={(e) => setParsedDraft({...parsedDraft, name: e.target.value})}
                         className="font-black text-green-900 bg-transparent outline-none w-full border-b border-transparent focus:border-green-300"
                       />
                       <p className="text-xs text-green-700 font-bold mt-1">Portion: {parsedDraft.portion}</p>
                     </div>
                   </div>

                   <div className="grid grid-cols-2 gap-2 mt-4">
                     <label className="text-xs font-bold text-green-800 flex items-center justify-between bg-white dark:bg-neutral-900 rounded p-1.5 shadow-sm">
                        Cals: <input type="number" value={parsedDraft.calories} onChange={e=>setParsedDraft({...parsedDraft, calories: parseInt(e.target.value) || 0})} className="w-12 text-right bg-transparent outline-none"/>
                     </label>
                     <label className="text-xs font-bold text-green-800 flex items-center justify-between bg-white dark:bg-neutral-900 rounded p-1.5 shadow-sm">
                        Prot (g): <input type="number" value={parsedDraft.protein} onChange={e=>setParsedDraft({...parsedDraft, protein: parseInt(e.target.value) || 0})} className="w-12 text-right bg-transparent outline-none"/>
                     </label>
                     <label className="text-xs font-bold text-green-800 flex items-center justify-between bg-white dark:bg-neutral-900 rounded p-1.5 shadow-sm">
                        Carb (g): <input type="number" value={parsedDraft.carbs} onChange={e=>setParsedDraft({...parsedDraft, carbs: parseInt(e.target.value) || 0})} className="w-12 text-right bg-transparent outline-none"/>
                     </label>
                     <label className="text-xs font-bold text-green-800 flex items-center justify-between bg-white dark:bg-neutral-900 rounded p-1.5 shadow-sm">
                        Fat (g): <input type="number" value={parsedDraft.fats} onChange={e=>setParsedDraft({...parsedDraft, fats: parseInt(e.target.value) || 0})} className="w-12 text-right bg-transparent outline-none"/>
                     </label>
                   </div>
                   
                   <div className="flex gap-2 mt-4">
                     <button onClick={() => setParsedDraft(null)} className="w-full py-2 bg-white dark:bg-neutral-900 text-green-900 font-bold rounded-xl border border-green-200 hover:bg-neutral-50 dark:bg-neutral-950 transition-colors text-sm">Discard</button>
                     <button onClick={commitParsedFood} className="w-full py-2 bg-green-600 text-white font-bold rounded-xl shadow-md hover:bg-green-500 transition-colors text-sm">Log Entry</button>
                   </div>
                </div>
              )}
            </div>

            {/* Activity Logger */}
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
              <h3 className="text-sm uppercase tracking-wider font-bold text-neutral-400 mb-6">Activity & Workout</h3>
              
              <div className="grid grid-cols-2 gap-4 mb-6">
                 <div>
                    <span className="text-xs font-black text-neutral-400 mb-1 block">STEPS</span>
                    <span className="text-2xl font-black text-neutral-800 dark:text-neutral-200">{steps}</span>
                 </div>
                 <div>
                    <span className="text-xs font-black text-neutral-400 mb-1 block">WORKOUT</span>
                    <span className="text-2xl font-black text-neutral-800 dark:text-neutral-200">{workoutMins}m</span>
                 </div>
              </div>

              <div className="space-y-4">
                <div className="flex gap-2">
                  <input type="number" placeholder="Steps" value={newSteps} onChange={e=>setNewSteps(e.target.value)} className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-950 rounded-xl text-sm font-bold border border-transparent focus:border-green-500 focus:outline-none" />
                  <input type="number" placeholder="Mins" value={newWorkout} onChange={e=>setNewWorkout(e.target.value)} className="w-full px-4 py-2 bg-neutral-50 dark:bg-neutral-950 rounded-xl text-sm font-bold border border-transparent focus:border-green-500 focus:outline-none" />
                </div>
                <button onClick={logActivity} className="w-full py-2 bg-neutral-900 text-white rounded-xl text-sm font-bold hover:bg-neutral-800 transition-colors cursor-pointer">Log Metrics</button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: AI Recommendations & Log */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* AI Recommendation Engine */}
            <div className="bg-neutral-900 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden flex flex-col justify-between">
              <div className="relative z-10 w-full">
                <h3 className="text-xl font-bold mb-2 flex items-center gap-2">🧠 AI Nutritionist</h3>
                <p className="text-neutral-400 mb-6 text-sm max-w-lg">Let Nutrabite's AI prescribe your exact macros. Choose your meal type below and get chef-quality recommendations strictly under ₹{budget} that perfectly fit your daily macro goals.</p>
                
                {!aiRecommendations || aiRecommendations.length === 0 ? (
                  <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <select 
                      value={selectedMealType} 
                      onChange={e => setSelectedMealType(e.target.value)}
                      className="bg-neutral-800 text-white border border-neutral-700 px-4 py-3 rounded-xl focus:outline-none font-bold w-full sm:w-auto"
                    >
                      <option value="Breakfast">Breakfast</option>
                      <option value="Lunch">Lunch</option>
                      <option value="Dinner">Dinner</option>
                      <option value="Snacks">Snacks</option>
                    </select>

                    <button 
                      onClick={handleGetRecommendation}
                      disabled={isAiLoading || caloriesRemaining <= 0}
                      className="bg-green-600 text-white font-bold py-3 px-8 rounded-xl hover:bg-green-500 transition-all shadow-[0_0_20px_rgba(34,197,94,0.3)] disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
                    >
                      {isAiLoading ? 'Analyzing Macros...' : `Recommend ${selectedMealType}`}
                    </button>
                  </div>
                ) : (
                  <div className="bg-white dark:bg-neutral-900/5 backdrop-blur border border-white/10 rounded-2xl p-6 relative">
                    <div className="flex justify-between items-center mb-4">
                       <p className="font-bold text-green-300">{aiRecommendations[currentRecIndex].message}</p>
                       <div className="flex gap-2 items-center bg-black/40 rounded-full px-2 py-1">
                          <button 
                            onClick={() => setCurrentRecIndex(prev => Math.max(0, prev - 1))}
                            disabled={currentRecIndex === 0}
                            className="text-white hover:text-green-400 disabled:opacity-30 disabled:hover:text-white"
                          >
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                          </button>
                          <span className="text-xs font-black text-white w-12 text-center">{currentRecIndex + 1} / {aiRecommendations.length}</span>
                          <button 
                             onClick={() => setCurrentRecIndex(prev => Math.min(aiRecommendations.length - 1, prev + 1))}
                             disabled={currentRecIndex === aiRecommendations.length - 1}
                             className="text-white hover:text-green-400 disabled:opacity-30 disabled:hover:text-white"
                          >
                             <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                          </button>
                       </div>
                    </div>
                    
                    <p className="text-[10px] uppercase tracking-widest text-neutral-400 font-bold mb-2">Recommended Kitchen</p>
                    <div className="flex items-center gap-3 mb-6 bg-black/20 p-3 rounded-xl w-fit">
                      <span className="font-black text-lg">{aiRecommendations[currentRecIndex].kitchen.name}</span>
                      <span className="bg-green-500/20 text-green-300 px-2.5 py-1 rounded-md text-xs font-bold">⭐ {aiRecommendations[currentRecIndex].kitchen.rating}</span>
                    </div>

                    <div className="space-y-4 mb-6">
                      {aiRecommendations[currentRecIndex].items.map((item: any, idx: number) => (
                        <div key={idx} className="flex justify-between items-center text-sm border-l-2 border-green-500 pl-4">
                          <div className="flex items-center gap-3">
                            <div className="relative w-10 h-10 rounded-lg overflow-hidden flex-shrink-0">
                              <Image src={item.image} alt={item.name} fill className="object-cover" />
                            </div>
                            <div>
                              <span className="font-bold text-white block">{item.name}</span>
                              <span className="text-neutral-400 text-xs mt-1 block">Prot: {item.protein}g • Carb: {item.carbs}g • Fat: {item.fat}g</span>
                            </div>
                          </div>
                          <div className="text-right flex-shrink-0">
                             <span className="font-bold text-green-300 block">₹{item.price}</span>
                             <span className="text-neutral-400 text-xs block">{item.calories} kcal</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="grid grid-cols-3 gap-2 mb-6">
                       <div className="bg-black/30 p-2 rounded-lg text-center"><span className="block text-[10px] text-neutral-400 font-black uppercase">Tot. Protein</span><span className="font-bold text-white text-sm">{aiRecommendations[currentRecIndex].macros.protein}g</span></div>
                       <div className="bg-black/30 p-2 rounded-lg text-center"><span className="block text-[10px] text-neutral-400 font-black uppercase">Tot. Carbs</span><span className="font-bold text-white text-sm">{aiRecommendations[currentRecIndex].macros.carbs}g</span></div>
                       <div className="bg-black/30 p-2 rounded-lg text-center"><span className="block text-[10px] text-neutral-400 font-black uppercase">Tot. Fats</span><span className="font-bold text-white text-sm">{aiRecommendations[currentRecIndex].macros.fat}g</span></div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-white/20">
                      <span className="font-bold text-neutral-300 tracking-tight">Basket Total: <span className="text-white text-xl ml-1">₹{aiRecommendations[currentRecIndex].totalPrice}</span></span>
                      <div className="flex gap-2">
                        <button onClick={() => setAiRecommendations([])} className="px-4 py-2 font-bold text-xs bg-white dark:bg-neutral-900/10 hover:bg-white dark:bg-neutral-900/20 rounded-xl transition-colors">Discard</button>
                        <button onClick={logAiMeal} className="px-5 py-2 font-bold text-xs bg-green-500 text-white rounded-xl shadow-[0_0_15px_rgba(34,197,94,0.4)] hover:bg-green-400 transition-colors">Log & Deduct</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Expandable Consumption Log */}
            <div className="bg-white dark:bg-neutral-900 p-8 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm">
              <h3 className="text-xl font-bold text-neutral-900 dark:text-neutral-100 mb-6">Recorded Food Timetable</h3>
              <div className="space-y-4">
                
                {/* Baseline Meal UI */}
                <div className="flex items-start gap-4">
                  <div className="text-xs font-black text-neutral-400 w-16 flex-shrink-0 uppercase tracking-tighter mt-4">08:00 AM</div>
                  <div className="w-full flex-grow p-4 bg-neutral-50 dark:bg-neutral-950 rounded-2xl border border-neutral-100 dark:border-neutral-800">
                    <div className="flex justify-between items-center cursor-pointer">
                      <span className="font-bold text-neutral-800 dark:text-neutral-200 text-sm">Example Static Meal</span>
                      <span className="text-neutral-500 dark:text-neutral-400 font-black text-sm">650 kcal</span>
                    </div>
                  </div>
                </div>

                {consumedMeals.map((log, idx) => {
                  const isExpanded = expandedLogs.includes(idx);
                  return (
                  <div key={idx} className="flex items-start gap-4 group">
                    <div className="text-xs font-black text-neutral-400 w-16 flex-shrink-0 uppercase tracking-tighter mt-4">{log.time}</div>
                    
                    <div 
                      onClick={() => toggleExpandLog(idx)}
                      className="flex flex-col gap-4 w-full flex-grow p-4 bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 rounded-2xl shadow-sm hover:border-green-400 hover:shadow-md transition-all cursor-pointer"
                    >
                      <div className="flex items-center gap-4">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden flex-shrink-0 border border-neutral-100 dark:border-neutral-800">
                          <Image src={log.meal.image} alt={log.meal.name} fill className="object-cover" />
                        </div>
                        <div className="flex-grow">
                           <p className="font-bold text-neutral-800 dark:text-neutral-200 text-sm leading-tight">{log.meal.name}</p>
                           {log.meal.portion && <p className="text-[10px] text-neutral-400 font-bold mt-0.5">Portion: {log.meal.portion}</p>}
                        </div>
                        <div className="text-right flex items-center justify-center gap-2">
                           <div>
                             <span className="block font-black text-neutral-800 dark:text-neutral-200 text-sm">{log.meal.calories} kcal</span>
                             {log.meal.price > 0 && <span className="block font-medium text-neutral-400 text-xs text-right mt-0.5">₹{log.meal.price}</span>}
                           </div>
                           <svg className={`w-4 h-4 text-neutral-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>

                      {/* Expandable Makro Detail */}
                      {isExpanded && (
                        <div className="grid grid-cols-3 gap-2 pt-3 border-t border-neutral-100 dark:border-neutral-800 animate-in fade-in slide-in-from-top-1">
                          <div className="bg-neutral-50 dark:bg-neutral-950 px-3 py-2 rounded-xl border border-neutral-100 dark:border-neutral-800 text-center">
                            <span className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider">Protein</span>
                            <span className="font-bold text-neutral-800 dark:text-neutral-200">{log.meal.protein}g</span>
                          </div>
                          <div className="bg-neutral-50 dark:bg-neutral-950 px-3 py-2 rounded-xl border border-neutral-100 dark:border-neutral-800 text-center">
                            <span className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider">Carbs</span>
                            <span className="font-bold text-neutral-800 dark:text-neutral-200">{log.meal.carbs}g</span>
                          </div>
                          <div className="bg-neutral-50 dark:bg-neutral-950 px-3 py-2 rounded-xl border border-neutral-100 dark:border-neutral-800 text-center">
                            <span className="block text-[10px] font-black text-neutral-400 uppercase tracking-wider">Fats</span>
                            <span className="font-bold text-neutral-800 dark:text-neutral-200">{log.meal.fat || log.meal.fats}g</span>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )})}

              </div>
            </div>

          </div>
        </div>
      )}

      {/* Orders Tab unchanged */}
      {activeTab === 'orders' && (
        <div className="space-y-6">
          {orders.map((order) => (
             <div key={order.id} className="bg-white dark:bg-neutral-900 rounded-3xl border border-neutral-100 dark:border-neutral-800 shadow-sm overflow-hidden">
               <div className="p-6 flex justify-between items-center bg-neutral-50 dark:bg-neutral-950/50">
                 <div>
                   <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Order ID</p>
                   <p className="text-lg font-bold text-neutral-900 dark:text-neutral-100">#{order.id.slice(-6).toUpperCase()}</p>
                 </div>
                 <div className="text-right">
                   <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mb-1">Date</p>
                   <p className="text-sm font-medium text-neutral-900 dark:text-neutral-100">{order.date}</p>
                 </div>
               </div>
               <div className="p-6">
                 <div className="flex justify-between items-start mb-4">
                   <div className="text-sm text-neutral-600 dark:text-neutral-400 max-w-sm">
                     {order.items}
                   </div>
                   <div className="text-right">
                     <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'Paid' ? 'bg-green-100 text-green-700' : 'bg-neutral-100 text-neutral-700'}`}>
                       {order.status}
                     </span>
                   </div>
                 </div>
                 <div className="border-t border-neutral-100 dark:border-neutral-800 pt-4 flex justify-between items-center">
                   <span className="font-bold text-neutral-500">Total Amount</span>
                   <span className="font-black text-lg">₹{order.total.toFixed(2)}</span>
                 </div>
               </div>
             </div>
           ))}
        </div>
      )}

    </div>
  );
}
