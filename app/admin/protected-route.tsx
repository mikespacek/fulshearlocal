"use client";

import { ReactNode } from "react";
import { useAuth } from "./auth-provider";
import AdminLogin from "./login";

export default function AdminProtectedRoute({ children }: { children: ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  
  if (!isAuthenticated) {
    return <AdminLogin />;
  }
  
  return (
    <div className="min-h-screen flex flex-col">
      {/* Add logout button in the corner */}
      <div className="absolute top-4 right-4 z-50">
        <button
          onClick={logout}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 bg-white rounded-md shadow hover:shadow-md transition-all"
        >
          Logout
        </button>
      </div>
      
      {children}
    </div>
  );
} 