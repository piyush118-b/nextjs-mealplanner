'use client';

import { ThemeProvider } from "@/context/theme-context";
import { ReactQueryClientProvider } from "@/components/react-query-client-provider";
import { ClerkProvider } from "@clerk/nextjs";
import CreateProfileOnSignIn from "@/components/create-profile";
import NavBar from "@/components/navbar";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ThemeProviderWrapper({ 
  children 
}: { 
  children: React.ReactNode 
}) {
  return (
    <ThemeProvider>
      <ReactQueryClientProvider>
        <ClerkProvider>
          <CreateProfileOnSignIn />
          <NavBar />
          <main className="max-w-7xl mx-auto pt-16 p-4 min-h-screen">
            {children}
            <ThemeToggle />
          </main>
        </ClerkProvider>
      </ReactQueryClientProvider>
    </ThemeProvider>
  );
}
