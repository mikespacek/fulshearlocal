"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { ArrowRight, CheckCircle, AlertCircle } from "lucide-react";

// Define result type
interface UpdateResult {
  success: boolean;
  message: string;
  timestamp: number;
}

export default function UpdateCategoriesPage() {
  const [adminKey, setAdminKey] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<UpdateResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const reassignBusinessCategories = useMutation(api.updateBusinessCategories.reassignBusinessCategories);

  const handleUpdateCategories = async () => {
    if (!adminKey) {
      setError("Admin key is required");
      return;
    }

    setIsLoading(true);
    setError(null);
    
    try {
      const result = await reassignBusinessCategories({ adminKey });
      setResult(result as UpdateResult);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-6">Admin: Update Business Categories</h1>
          
          <Card className="mb-6">
            <CardHeader>
              <CardTitle>Reassign Business Categories</CardTitle>
              <CardDescription>
                This utility will analyze all businesses and reassign them to the appropriate categories
                based on their names and content.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <label htmlFor="adminKey" className="block text-sm font-medium mb-1">
                    Admin Key
                  </label>
                  <Input
                    id="adminKey"
                    type="password"
                    value={adminKey}
                    onChange={(e) => setAdminKey(e.target.value)}
                    placeholder="Enter admin key"
                    className="max-w-md"
                  />
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                onClick={handleUpdateCategories} 
                disabled={isLoading || !adminKey}
                className="flex items-center gap-2"
              >
                {isLoading ? "Processing..." : "Update Categories"}
                {!isLoading && <ArrowRight className="h-4 w-4" />}
              </Button>
            </CardFooter>
          </Card>
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6 flex items-start">
              <AlertCircle className="h-5 w-5 text-red-500 mr-3 mt-0.5 flex-shrink-0" />
              <div>
                <h3 className="text-sm font-medium text-red-800">Error</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}
          
          {result && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                  Success
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  <p className="mb-2">{result.message}</p>
                  <p className="text-xs text-gray-500">
                    Processed at: {new Date(result.timestamp).toLocaleString()}
                  </p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
} 