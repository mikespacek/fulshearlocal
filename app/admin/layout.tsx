"use client";

import { AuthProvider } from "./auth-provider";
import { ReactNode } from "react";
import AdminProtectedRoute from "./protected-route";

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AdminProtectedRoute>
        {children}
      </AdminProtectedRoute>
    </AuthProvider>
  );
} 