// components/MealPlanDashboard.tsx
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Spinner } from "@/components/spinner";

// Define the DailyMealPlan interface
export interface DailyMealPlan {
  Breakfast?: string;
  Lunch?: string;
  Dinner?: string;
  Snacks?: string;
}

interface WeeklyMealPlan {
  [day: string]: DailyMealPlan;
}

interface MealPlanResponse {
  mealPlan?: WeeklyMealPlan;
  error?: string;
}

interface MealPlanInput {
  dietType: string;
  calories: number;
  allergies: string;
  cuisine: string;
  snacks: boolean;
  days?: number;
}

// Meal Time Card Component
function MealTimeCard({ time, meal, icon, className = '' }: { time: string; meal?: string; icon: string; className?: string }) {
  if (!meal) return null;
  
  return (
    <div className={`bg-gray-50 rounded-lg p-3 transition-colors ${className}`}>
      <div className="flex items-start space-x-3">
        <span className="text-xl">{icon}</span>
        <div className="flex-1 min-w-0">
          <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">
            {time}
          </h4>
          <p className="text-sm text-gray-800 leading-tight">
            {meal}
          </p>
        </div>
      </div>
    </div>
  );
}

export default function MealPlanDashboard() {
  const [dietType, setDietType] = useState("");
  const [calories, setCalories] = useState<number>(2000);
  const [allergies, setAllergies] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [snacks, setSnacks] = useState(false);
  const [days, setDays] = useState<number>(7);
  const [currentMealPlan, setCurrentMealPlan] = useState<WeeklyMealPlan | null>(null);

  // Initialize the mutation using React Query
  const mutation = useMutation<MealPlanResponse, Error, MealPlanInput>({
    mutationFn: async (input) => {
      const response = await fetch("/api/generate-mealplan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(input),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || "Failed to generate meal plan");
      }

      return response.json();
    },
    onSuccess: (data) => {
      if (data.error) {
        throw new Error(data.error);
      }
      if (data.mealPlan) {
        setCurrentMealPlan(data.mealPlan);
      }
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const payload: MealPlanInput = {
      dietType,
      calories,
      allergies,
      cuisine,
      snacks,
      days,
    };

    mutation.mutate(payload);
  };

  // Define the days of the week in order
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Function to retrieve the meal plan for a specific day
  const getMealPlanForDay = (day: string): DailyMealPlan | null => {
    const plan = currentMealPlan || mutation.data?.mealPlan;
    if (!plan) return null;
    return plan[day as keyof WeeklyMealPlan] as DailyMealPlan || null;
  };

  // Download meal plan as text file
  const downloadMealPlan = () => {
    if (!currentMealPlan) return;
    
    let textContent = 'Your Weekly Meal Plan\n\n';
    
    Object.entries(currentMealPlan).forEach(([day, meals]) => {
      if (!meals) return;
      
      textContent += `${day.toUpperCase()}\n`;
      textContent += '='.repeat(day.length) + '\n';
      
      if (meals.Breakfast) textContent += `🍳 Breakfast: ${meals.Breakfast}\n`;
      if (meals.Lunch) textContent += `🥗 Lunch: ${meals.Lunch}\n`;
      if (meals.Dinner) textContent += `🍲 Dinner: ${meals.Dinner}\n`;
      if (meals.Snacks) textContent += `🍎 Snacks: ${meals.Snacks}\n`;
      
      textContent += '\n';
    });
    
    const blob = new Blob([textContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `meal-plan-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* <div className="text-center mb-12 py-8 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 dark:text-white mb-4">
              <span className="block">Nourish Your Body,</span>
              <span className="block text-blue-600 dark:text-blue-400">Simplify Your Life</span>
            </h1>
            <div className="mt-6 max-w-2xl mx-auto">
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                "Good food is the foundation of genuine happiness." - Auguste Escoffier
              </p>
              <div className="w-20 h-1 bg-blue-500 mx-auto rounded-full"></div>
              <p className="mt-8 text-lg text-gray-600 dark:text-gray-400">
                Create your personalized meal plan tailored to your taste, dietary needs, and lifestyle goals.
              </p>
            </div>
          </div>
        </div> */}
        
        <div className="grid gap-8 md:grid-cols-12">
          {/* Left Panel: Form */}
          <div className="md:col-span-4">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 h-full transition-colors duration-200">
              <form onSubmit={handleSubmit} className="space-y-5">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">Your Preferences</h2>
                <p className="text-gray-500 dark:text-gray-400 text-sm mb-6">Fill in your dietary needs and preferences</p>
                
                {/* Diet Type */}
                <div className="space-y-2">
                  <label htmlFor="dietType" className="block text-sm font-medium text-gray-700">
                    Diet Type
                  </label>
                  <select
                    id="dietType"
                    value={dietType}
                    onChange={(e) => setDietType(e.target.value)}
                    required
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                  >
                    <option value="">Select diet type</option>
                    <option value="vegetarian">Vegetarian</option>
                    <option value="vegan">Vegan</option>
                    <option value="keto">Keto</option>
                    <option value="paleo">Paleo</option>
                    <option value="mediterranean">Mediterranean</option>
                    <option value="none">No specific diet</option>
                  </select>
                </div>

                {/* Calories */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label htmlFor="calories" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Daily Calories
                    </label>
                    <span className="text-sm font-medium text-blue-600 dark:text-blue-400">{calories} kcal</span>
                  </div>
                  <input
                    type="range"
                    id="calories"
                    min="1200"
                    max="3000"
                    step="100"
                    value={calories}
                    onChange={(e) => setCalories(Number(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500"
                  />
                  <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
                    <span>1200</span>
                    <span>3000 kcal</span>
                  </div>
                </div>

                {/* Allergies */}
                <div className="space-y-2">
                  <label htmlFor="allergies" className="block text-sm font-medium text-gray-700">
                    Allergies & Restrictions
                  </label>
                  <input
                    type="text"
                    id="allergies"
                    value={allergies}
                    onChange={(e) => setAllergies(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                    placeholder="e.g., Nuts, Dairy, Gluten"
                  />
                </div>

                {/* Preferred Cuisine */}
                <div className="space-y-2">
                  <label htmlFor="cuisine" className="block text-sm font-medium text-gray-700">
                    Preferred Cuisine
                  </label>
                  <select
                    id="cuisine"
                    value={cuisine}
                    onChange={(e) => setCuisine(e.target.value)}
                    className="w-full px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-gray-900 dark:text-white"
                  >
                    <option value="">No preference</option>
                    <option value="indian">Indian</option>
                    <option value="italian">Italian</option>
                    <option value="mexican">Mexican</option>
                    <option value="asian">Asian</option>
                    <option value="mediterranean">Mediterranean</option>
                    <option value="american">American</option>
                  </select>
                </div>

                {/* Snacks */}
                <div className="flex items-center justify-between pt-2">
                  <div>
                    <label htmlFor="snacks-toggle" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Include Snacks
                    </label>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Add healthy snacks between meals</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      id="snacks-toggle"
                      className="sr-only peer"
                      checked={snacks}
                      onChange={(e) => setSnacks(e.target.checked)}
                    />
                    <div className="
                      w-11 h-6 
                      bg-gray-200 
                      rounded-full 
                      peer 
                      peer-checked:bg-blue-500 
                      dark:peer-checked:bg-blue-500
                      dark:bg-gray-600 
                      transition-colors 
                      duration-200
                      after:content-['']
                      after:absolute
                      after:top-0.5
                      after:left-[2px]
                      after:bg-white
                      after:border
                      after:border-gray-300
                      after:rounded-full
                      after:h-5
                      after:w-5
                      after:transition-all
                      dark:after:border-gray-600
                      peer-checked:after:translate-x-5
                      after:shadow-md
                    "></div>
                  </label>
                </div>

                {/* Submit Button */}
                <div className="pt-4">
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className={`w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white py-3 px-6 rounded-xl font-medium shadow-md hover:shadow-lg transform hover:-translate-y-0.5 transition-all duration-200 ${
                      mutation.isPending ? 'opacity-70 cursor-not-allowed' : ''
                    }`}
                  >
                    {mutation.isPending ? (
                      <div className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Generating...
                      </div>
                    ) : (
                      'Generate Meal Plan'
                    )}
                  </button>
                </div>
              </form>

              {mutation.isError && (
                <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        {mutation.error?.message || "An error occurred. Please try again."}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Panel: Weekly Meal Plan */}
          <div className="md:col-span-8">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-md p-6 h-full transition-colors duration-200">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  Your Weekly Meal Plan
                </h2>
                <button 
                  onClick={downloadMealPlan}
                  disabled={!currentMealPlan}
                  className={`p-2 rounded-lg transition-colors ${
                    currentMealPlan 
                      ? 'text-blue-500 hover:bg-blue-50 dark:hover:bg-gray-700' 
                      : 'text-gray-300 dark:text-gray-600 cursor-not-allowed'
                  }`}
                  title={currentMealPlan ? 'Download Meal Plan' : 'Generate a meal plan first'}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                </button>
              </div>

              {mutation.isSuccess && mutation.data.mealPlan ? (
                <div className="h-[600px] overflow-y-auto pr-2">
                  <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    {daysOfWeek.map((day) => {
                      const mealPlan = getMealPlanForDay(day);
                      const isToday = new Date().toLocaleDateString('en-US', { weekday: 'long' }) === day;
                      
                      return (
                        <div
                          key={day}
                          className={`bg-white dark:bg-gray-700 border dark:border-gray-600 rounded-xl p-5 transition-all hover:shadow-md ${
                            isToday ? 'ring-2 ring-blue-500' : 'border-gray-200 dark:border-gray-600'
                          }`}
                        >
                          <div className="flex justify-between items-center mb-4">
                            <h3 className={`text-lg font-semibold ${isToday ? 'text-blue-600 dark:text-blue-400' : 'text-gray-800 dark:text-white'}`}>
                              {day}
                              {isToday && <span className="ml-2 text-xs px-2 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-200 rounded-full">Today</span>}
                            </h3>
                            <span className="text-xs font-medium px-2.5 py-1 rounded-full bg-gray-100 dark:bg-gray-600 text-gray-700 dark:text-gray-200">
                              {mealPlan ? 'Planned' : 'Not set'}
                            </span>
                          </div>
                          
                          {mealPlan ? (
                            <div className="space-y-4">
                              <MealTimeCard 
                                time="Breakfast" 
                                meal={mealPlan.Breakfast} 
                                icon="🍳"
                              />
                              <MealTimeCard 
                                time="Lunch" 
                                meal={mealPlan.Lunch} 
                                icon="🥗"
                              />
                              <MealTimeCard 
                                time="Dinner" 
                                meal={mealPlan.Dinner} 
                                icon="🍲"
                              />
                              {mealPlan.Snacks && (
                                <MealTimeCard 
                                  time="Snacks" 
                                  meal={mealPlan.Snacks} 
                                  icon="🍎"
                                  className="border-dashed"
                                />
                              )}
                            </div>
                          ) : (
                            <div className="text-center py-8">
                              <div className="mx-auto w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-600/50 flex items-center justify-center mb-3">
                                <span className="text-xl">🍽️</span>
                              </div>
                              <p className="text-gray-500 dark:text-gray-400 text-sm">
                                No meals planned for {day}
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : mutation.isPending ? (
                <div className="flex flex-col items-center justify-center h-[400px] text-center">
                  <div className="w-16 h-16 border-4 border-blue-100 dark:border-blue-900/30 border-t-blue-500 dark:border-t-blue-400 rounded-full animate-spin mb-4"></div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-1">Creating Your Meal Plan</h3>
                  <p className="text-gray-500 dark:text-gray-400">This may take a moment...</p>
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="mx-auto w-20 h-20 bg-blue-50 dark:bg-blue-900/20 rounded-full flex items-center justify-center mb-5">
                    <span className="text-3xl">🍽️</span>
                  </div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-white mb-2">No meal plan generated yet</h3>
                  <p className="text-gray-500 dark:text-gray-400 max-w-md mx-auto">
                    Fill in your preferences and click "Generate Meal Plan" to create your personalized weekly meal plan.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
