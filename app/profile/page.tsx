// app/profile/page.tsx
"use client";

import { useUser } from "@clerk/nextjs";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/spinner";

export default function ProfilePage() {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();

  // No subscription-related functionality needed

  // Loading or Not Signed In States
  if (!isLoaded) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-background">
        <Spinner className="h-8 w-8" />
        <span className="ml-3 text-foreground">Loading...</span>
      </div>
    );
  }

  if (!isSignedIn) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
        <p className="text-foreground mb-4">Please sign in to view your profile.</p>
        <button 
          onClick={() => router.push('/sign-in')}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Sign In
        </button>
      </div>
    );
  }

  // Main Profile Page UI
  return (
    <div className="min-h-screen bg-background p-4">
      {/* Toast notifications would go here */}
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-foreground mb-8">Your Profile</h1>
        
        <div className="bg-card text-card-foreground rounded-lg shadow-sm border">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              {/* Profile Image */}
              <div className="relative w-24 h-24 md:w-32 md:h-32 rounded-full overflow-hidden border-4 border-primary/20">
                <Image
                  src={user.imageUrl || "/default-avatar.png"} // Provide a default avatar if none
                  alt={`${user.firstName} ${user.lastName}'s profile`}
                  fill
                  className="object-cover"
                  priority
                />
              </div>
              
              {/* Profile Info */}
              <div className="text-center md:text-left">
                <h2 className="text-2xl font-bold text-foreground">
                  {user.firstName} {user.lastName}
                </h2>
                <p className="text-muted-foreground mb-4">
                  {user.primaryEmailAddress?.emailAddress}
                </p> 
                
                {/* Account Status */}
                <div className="bg-muted/50 p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-muted-foreground">Account Status</span>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">
                      Active
                    </span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Enjoy your meal planning experience! All features are now available to you.
                  </p>
                </div>
                
                {/* Additional Profile Actions */}
                <div className="mt-6 flex flex-col gap-3">
                  <button 
                    className="w-full md:w-auto px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                    onClick={() => router.push('/mealplan')}
                  >
                    View Meal Plans
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {/* Bottom Section: Additional Profile Info */}
          <div className="mt-8 border-t pt-6">
            <h3 className="text-lg font-semibold text-foreground mb-4">Account Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Member Since</h4>
                <p className="text-foreground">
                  {new Date(user.createdAt || Date.now()).toLocaleDateString()}
                </p>
              </div>
              <div className="bg-muted/50 p-4 rounded-lg">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Last Signed In</h4>
                <p className="text-foreground">
                  {user.lastSignInAt 
                    ? new Date(user.lastSignInAt).toLocaleString() 
                    : 'N/A'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
