import { createContext } from "react";

import { AuthContextType } from "@/backend/types/authTypes";
export const AuthContext = createContext<AuthContextType>({
  user: undefined,
  isLoading: true,
  error: undefined,
  refetchUser: () => {},
  setUser: () => {},
});
