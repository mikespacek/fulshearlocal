"use client";

import { useState } from "react";
import { useAuth } from "./auth-provider";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AlertCircle, Lock } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminLogin() {
  const { login } = useAuth();
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!password) {
      setError("Please enter a password");
      return;
    }
    
    const success = login(password);
    if (!success) {
      setError("Invalid password");
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-center">Fulshear Local</h1>
        <p className="text-center text-gray-600 mt-2">Admin Dashboard</p>
      </div>
      
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="w-5 h-5 mr-2" /> Admin Login
          </CardTitle>
          <CardDescription>
            Enter your password to access the admin dashboard
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleLogin}>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <Input
                  type="password"
                  placeholder="Enter admin password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertTitle>Error</AlertTitle>
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full bg-black hover:bg-gray-900">
              Login
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 