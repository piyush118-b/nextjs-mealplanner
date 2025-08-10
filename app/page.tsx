// app/page.tsx (HomePage)
"use client";

import { useState } from "react";
import { SignIn, SignUp } from "@clerk/nextjs";
import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-white dark:from-gray-900 dark:to-gray-800 p-6 transition-colors duration-200">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <section className="text-center py-16 sm:py-24 lg:py-32 px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-gray-900 dark:text-white mb-6">
              <span className="block">Nourish Your Body,</span>
              <span className="text-blue-600 dark:text-blue-400">Simplify Your Life</span>
            </h1>
            
            <div className="mt-8 max-w-2xl mx-auto">
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 leading-relaxed">
                "Good food is the foundation of genuine happiness." - Auguste Escoffier
              </p>
              <div className="w-24 h-1 bg-blue-500 mx-auto rounded-full mb-10"></div>
              
              <p className="text-lg md:text-xl text-gray-600 dark:text-gray-400 mb-10 max-w-2xl mx-auto">
                Let our AI create personalized meal plans tailored to your taste, dietary needs, and lifestyle goals.
              </p>
              
              <div className="flex flex-col sm:flex-row justify-center gap-4 mt-10">
                <Link
                  href="/mealplan"
                  className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 md:py-4 md:text-lg md:px-10 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Create Your Meal Plan
                </Link>
              </div>
            </div>
          </div>
        </section>

      </div>
      
      {/* How It Works Section */}
      <section id="how-it-works" className="mb-20">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-3">How It Works</h2>
          <p className="text-lg text-gray-600 dark:text-gray-300">
            Get your personalized meal plan in just three simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {/* Step 1 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full h-16 w-16 flex items-center justify-center mb-4 mx-auto">
              {/* Icon for Step 1 */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14v7m-3-3h6"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Create an Account</h3>
            <p className="text-center text-gray-600 dark:text-gray-300">
              Sign up or sign in to get started with your personalized meal planning journey.
            </p>
          </div>

          {/* Step 2 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full h-16 w-16 flex items-center justify-center mb-4 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Set Your Preferences</h3>
            <p className="text-center text-gray-600 dark:text-gray-300">
              Input your dietary preferences, restrictions, and goals to get a perfectly tailored meal plan.
            </p>
          </div>

          {/* Step 3 */}
          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow duration-300">
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full h-16 w-16 flex items-center justify-center mb-4 mx-auto">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-xl font-semibold mb-3 text-center">Get Your Meal Plan</h3>
            <p className="text-center text-gray-600 dark:text-gray-300">
              Receive your personalized meal plan with delicious recipes and a convenient shopping list.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
