// components/MealPlanDashboard.tsx
"use client";

import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

interface DailyMealPlan {
  breakfast?: string;
  lunch?: string;
  dinner?: string;
  snacks?: string;
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

export default function MealPlanDashboard() {
  const [dietType, setDietType] = useState("");
  const [calories, setCalories] = useState<number>(2000);
  const [allergies, setAllergies] = useState("");
  const [cuisine, setCuisine] = useState("");
  const [snacks, setSnacks] = useState(false);

  // Initialize the mutation
  const mutation = useMutation<MealPlanResponse, Error, MealPlanInput>({
    mutationFn: async (payload: MealPlanInput) => {
      const response = await fetch("/api/generate-mealplan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData: MealPlanResponse = await response.json();
        throw new Error(errorData.error || "Failed to generate meal plan.");
      }

      return response.json();
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
      days: 7, // Generate a week's plan
    };

    mutation.mutate(payload);
  };

  // Generate an array of days for the calendar
  const daysOfWeek = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  // Function to map meal plans to dates
  const getMealPlanForDate = (date: Date): DailyMealPlan | undefined => {
    if (!mutation.data?.mealPlan) return undefined;

    const dayName = daysOfWeek[date.getDay()];
    return mutation.data.mealPlan[dayName];
  };

  return (
    <div className="min-h-screen flex bg-gray-100">
      {/* Left Panel: Form */}
      <div className="w-full md:w-1/3 lg:w-1/4 p-6 bg-white shadow-md">
        <h1 className="text-2xl font-bold mb-4">AI Meal Plan Generator</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Diet Type */}
          <div>
            <label
              htmlFor="dietType"
              className="block text-sm font-medium text-gray-700"
            >
              Diet Type
            </label>
            <input
              type="text"
              id="dietType"
              value={dietType}
              onChange={(e) => setDietType(e.target.value)}
              required
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="e.g., Vegetarian, Keto, Mediterranean"
            />
          </div>

          {/* Calories */}
          <div>
            <label
              htmlFor="calories"
              className="block text-sm font-medium text-gray-700"
            >
              Daily Calorie Goal
            </label>
            <input
              type="number"
              id="calories"
              value={calories}
              onChange={(e) => setCalories(Number(e.target.value))}
              required
              min={500}
              max={5000}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="e.g., 2000"
            />
          </div>

          {/* Allergies */}
          <div>
            <label
              htmlFor="allergies"
              className="block text-sm font-medium text-gray-700"
            >
              Allergies or Restrictions
            </label>
            <input
              type="text"
              id="allergies"
              value={allergies}
              onChange={(e) => setAllergies(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="e.g., Nuts, Dairy, None"
            />
          </div>

          {/* Preferred Cuisine */}
          <div>
            <label
              htmlFor="cuisine"
              className="block text-sm font-medium text-gray-700"
            >
              Preferred Cuisine
            </label>
            <input
              type="text"
              id="cuisine"
              value={cuisine}
              onChange={(e) => setCuisine(e.target.value)}
              className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              placeholder="e.g., Italian, Chinese, No Preference"
            />
          </div>

          {/* Snacks */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="snacks"
              checked={snacks}
              onChange={(e) => setSnacks(e.target.checked)}
              className="h-4 w-4 text-blue-600 border-gray-300 rounded"
            />
            <label
              htmlFor="snacks"
              className="ml-2 block text-sm text-gray-700"
            >
              Include Snacks
            </label>
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={mutation.isPending}
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {mutation.isPending ? "Generating..." : "Generate Meal Plan"}
            </button>
          </div>
        </form>

        {/* Error Message */}
        {mutation.isError && (
          <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md">
            {mutation.error?.message || "An unexpected error occurred."}
          </div>
        )}
      </div>

      {/* Right Panel: Calendar */}
      <div className="flex-1 p-6">
        <h2 className="text-2xl font-bold mb-4">Weekly Meal Plan</h2>

        {mutation.isSuccess && mutation.data.mealPlan ? (
          <Calendar
            // calendarType="US"
            tileContent={({ date, view }) =>
              view === "month" ? (
                <MealPlanCard mealPlan={getMealPlanForDate(date)} />
              ) : null
            }
            // Optionally, highlight the current day
            tileClassName={({ date, view }) =>
              view === "month" &&
              date.toDateString() === new Date().toDateString()
                ? "bg-blue-100"
                : undefined
            }
          />
        ) : (
          <p>Please generate a meal plan to see it on the calendar.</p>
        )}
      </div>
    </div>
  );
}

// Helper Component to Display Meal Plan in Calendar Tiles
interface MealPlanCardProps {
  mealPlan?: DailyMealPlan;
}

const MealPlanCard: React.FC<MealPlanCardProps> = ({ mealPlan }) => {
  if (!mealPlan) return null;

  return (
    <div className="mt-2 p-2 bg-blue-50 rounded-md text-xs">
      <strong>Breakfast:</strong> {mealPlan.breakfast}
      <br />
      <strong>Lunch:</strong> {mealPlan.lunch}
      <br />
      <strong>Dinner:</strong> {mealPlan.dinner}
      {mealPlan.snacks && (
        <>
          <br />
          <strong>Snacks:</strong> {mealPlan.snacks}
        </>
      )}
    </div>
  );
};
