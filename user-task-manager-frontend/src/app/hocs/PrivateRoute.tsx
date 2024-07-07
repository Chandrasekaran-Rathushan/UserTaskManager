"use client";

import Loader from "@/app/components/loader/loader";
import { useAuth } from "@/app/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

interface PrivateRouteProps {
  children: JSX.Element;
}

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    localStorage.setItem("currentPage ", window.location.pathname);
    if (!isAuthenticated) {
      setTimeout(() => router.push("/app-auth"), 500);
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return <Loader />;
  }

  return children;
};

export default PrivateRoute;
