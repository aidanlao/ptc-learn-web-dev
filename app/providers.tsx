"use client";

import * as React from "react";
import { HeroUIProvider } from "@heroui/system";
import { useRouter } from "next/navigation";
import { ThemeProvider as NextThemesProvider } from "next-themes";
import { ThemeProviderProps } from "next-themes/dist/types";

import { AuthContextType } from "@/backend/types/authTypes";
import { AuthContext } from "@/providers/authContext";
import { useAuth } from "@/backend/auth/authHooks";

export interface ProvidersProps {
  children: React.ReactNode;
  themeProps?: ThemeProviderProps;
}

export function Providers({ children, themeProps }: ProvidersProps) {
  const router = useRouter();
  const {
    refetchUser,
    setUser,
    user,
    triggerLoading: isLoading,
    error,
  } = useAuth();
  // Provide all values and functions in an object
  const value: AuthContextType = {
    user,
    isLoading,
    error,
    refetchUser,
    setUser,
  };

  return (
    <AuthContext.Provider value={value}>
      <HeroUIProvider navigate={router.push}>
        <NextThemesProvider {...themeProps}>{children}</NextThemesProvider>
      </HeroUIProvider>
    </AuthContext.Provider>
  );
}
