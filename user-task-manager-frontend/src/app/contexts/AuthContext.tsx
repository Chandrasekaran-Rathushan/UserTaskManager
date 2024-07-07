"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import { useSnackbar } from "./SnackbarContext";
import { apiRequest } from "@/app/api/apiRequest";
import { AppDispatch, resetState } from "@/store/store";
import { useDispatch } from "react-redux";

interface User {
  id: string | undefined | null;
  userName: string | undefined | null;
  email: string | undefined | null;
}

interface LoggedUser extends User {
  accessToken: string;
  refreshToken: string;
  tokenType: "Bearer";
  expiresIn: number;
}

interface AuthContextType {
  user: LoggedUser | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getUserId: () => string | null;
  getUserToken: () => string | null;
  registerUser: (
    email: string,
    password: string,
    successCallback: Function
  ) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<LoggedUser | null>(null);
  const router = useRouter();
  const { openSnackbar } = useSnackbar();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!!user) {
      router.push(localStorage.getItem("currentPage ") || "/");
    }
  }, [user, router]);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const response = await apiRequest<User>({
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/users/currentProfile`,
        method: "GET",
        token: user?.accessToken,
      });

      const userData: LoggedUser = { ...user, ...response } as LoggedUser;

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    };

    if (user?.accessToken) {
      fetchUserDetails();
    }
  }, [user?.accessToken]);

  const login = async (email: string, password: string) => {
    try {
      const response = await apiRequest<LoggedUser>({
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/login`,
        method: "POST",
        data: {
          email,
          password,
        },
      });

      const userData: LoggedUser = response;

      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
    } catch (error: any) {
      const errorMessage = error?.message || "Login failed";
      openSnackbar(errorMessage, "error");
    }
  };

  const registerUser = async (
    email: string,
    password: string,
    successCallback: Function
  ) => {
    try {
      const response = await apiRequest<LoggedUser>({
        url: `${process.env.NEXT_PUBLIC_API_BASE_URL}/register`,
        method: "POST",
        data: {
          email,
          password,
        },
      });
      successCallback();
      openSnackbar("User created successfully!", "success");
    } catch (error: any) {
      const errorMessage = error?.message || "Login failed";
      openSnackbar(errorMessage, "error");
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
    dispatch(resetState());
  };

  const getUserId = () => user?.id || null;

  const getUserToken = () => user?.accessToken || null;

  const contextValue: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    logout,
    getUserId,
    getUserToken,
    registerUser,
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
