import { Navigate } from "react-router-dom";
import { ReactNode, useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { Loading } from "../../components/Loading";

interface ProtectedRouteProps {
  children: ReactNode;
}

interface JwtPayload {
  exp: number;
}

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("authToken");

    if (!token) {
      setIsAuthenticated(false);
      setIsLoading(false);
      return;
    }

    try {
      const decoded = jwtDecode<JwtPayload>(token);
      const now = Date.now() / 1000;

      if (decoded.exp < now) {
        localStorage.removeItem("authToken");
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }
    } catch (error) {
      localStorage.removeItem("authToken");
      setIsAuthenticated(false);
    }

    setIsLoading(false);
  }, []);

  if (isLoading) return <Loading />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
};
