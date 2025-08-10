// app/components/NavBar.js

"use client";

import Link from "next/link";
import Image from "next/image";
import { useUser, SignedIn, SignedOut, SignOutButton } from "@clerk/nextjs";

export default function NavBar() {
  const { isLoaded, isSignedIn, user } = useUser();

  if (!isLoaded) {
    // Optionally, return a loading indicator or skeleton here
    return null;
  }

  return (
    <nav className="fixed top-0 left-0 w-full bg-background/80 backdrop-blur-md border-b border-border/40 z-50">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        {/* Brand / Logo */}
        <Link href="/" className="flex items-center space-x-2">
          <div className="flex items-center space-x-3">
            
            <span className="text-2xl font-bold bg-gradient-to-r from-primary to-primary/80 bg-clip-text text-transparent">
              TasteTrack
            </span>
          </div>
        </Link>

        {/* Navigation Links */}
        <div className="space-x-6 flex items-center">
          {/* Authentication Buttons */}
          <SignedIn>
            <Link
              href="/mealplan"
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              Meal Plans
            </Link>
            {/* Profile Picture */}
            {user?.imageUrl ? (
              <Link href="/profile">
                <Image
                  src={user.imageUrl}
                  alt="Profile Picture"
                  width={40}
                  height={40}
                  className="rounded-full border-2 border-primary/20 hover:border-primary/40 transition-colors"
                />
              </Link>
            ) : (
              // Placeholder for users without a profile picture
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <span className="text-foreground/70 text-lg font-medium">
                  {user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || 'U'}
                </span>
              </div>
            )}

            {/* Sign Out Button */}
            <div className="ml-4">
              <SignOutButton>
                <button className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium">
                  Sign Out
                </button>
              </SignOutButton>
            </div>
          </SignedIn>

          <SignedOut>
            <Link
              href="/"
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              Home
            </Link>
            {/* <Link
              href={isSignedIn ? "/subscribe" : "/sign-up"}
              className="text-foreground/80 hover:text-primary transition-colors font-medium"
            >
              Subscribe
            </Link> */}

            <Link
              href="/sign-up"
              className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors font-medium"
            >
              Sign Up
            </Link>
          </SignedOut>
        </div>
      </div>
    </nav>
  );
}
