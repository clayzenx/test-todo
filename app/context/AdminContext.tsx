"use client";
import { createContext, useState, useEffect, ReactNode } from "react";
import { jwtDecode } from "jwt-decode";

type Token = { role: string };
type AdminContextType = {
  isAdmin: boolean;
  setToken: (token: string | null) => void;
};

export const AdminContext = createContext<AdminContextType>({
  isAdmin: false,
  setToken: () => {},
});

export function AdminProvider({ children }: { children: ReactNode }) {
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode<Token>(token);
        setIsAdmin(decoded.role === "admin");
      } catch {
        setIsAdmin(false);
      }
    }
  }, []);

  const setToken = (token: string | null) => {
    if (token) {
      localStorage.setItem("token", token);
      try {
        const decoded = jwtDecode<Token>(token);
        setIsAdmin(decoded.role === "admin");
      } catch {
        setIsAdmin(false);
      }
    } else {
      localStorage.removeItem("token");
      setIsAdmin(false);
    }
  };

  return (
    <AdminContext.Provider value={{ isAdmin, setToken }}>
      {children}
    </AdminContext.Provider>
  );
}
