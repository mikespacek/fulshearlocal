"use client";

import { AuthProvider } from "./auth-provider";
import { ReactNode } from "react";
import AdminProtectedRoute from "./protected-route";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminProtectedRoute>
        <div className="bg-gray-50 min-h-screen">
          {children}
        </div>
      </AdminProtectedRoute>
    </AuthProvider>
  );
} 