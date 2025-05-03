"use client";

import { useState } from "react";
import { useAction, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Navbar } from "@/components/navbar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertCircle, Check, RefreshCw, Trash } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export default function AdminPage() {
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Get business count for display
  const businesses = useQuery(api.businesses.getAll);
  const categories = useQuery(api.categories.getAll);
  
  // Import action
  const importPlaces = useAction(api.importGooglePlaces.importFulshearBusinesses);
  
  // Handle the import
  const handleImport = async () => {
    if (!googleApiKey) {
      setError("Please enter a Google API key");
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      setResult(null);
      
      const importResult = await importPlaces({ googleApiKey });
      setResult(importResult);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : "Unknown error occurred"}`);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-1 py-12">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            <Card>
              <CardHeader>
                <CardTitle>Database Status</CardTitle>
                <CardDescription>Current data in the database</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Businesses:</span>
                    <span className="font-semibold">{businesses ? businesses.length : "Loading..."}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Categories:</span>
                    <span className="font-semibold">{categories ? categories.length : "Loading..."}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Google Places Import</CardTitle>
                <CardDescription>Import real businesses from Google Places API</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label htmlFor="apiKey" className="block text-sm font-medium mb-1">
                      Google Places API Key
                    </label>
                    <Input
                      id="apiKey"
                      type="password"
                      value={googleApiKey}
                      onChange={(e) => setGoogleApiKey(e.target.value)}
                      placeholder="Enter your Google Places API key"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      The API key must have the Places API enabled and billing activated
                    </p>
                  </div>
                  
                  {error && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertTitle>Error</AlertTitle>
                      <AlertDescription>{error}</AlertDescription>
                    </Alert>
                  )}
                  
                  {result && (
                    <Alert variant="success" className="bg-green-50 border-green-200">
                      <Check className="h-4 w-4 text-green-600" />
                      <AlertTitle className="text-green-800">Success</AlertTitle>
                      <AlertDescription className="text-green-700">
                        {result.message}
                        {result.results && (
                          <div className="mt-2">
                            <p>Added: {result.results.successful}</p>
                            <p>Failed: {result.results.failed}</p>
                            <p>Total processed: {result.results.totalProcessed}</p>
                          </div>
                        )}
                      </AlertDescription>
                    </Alert>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={handleImport} 
                  disabled={loading || !googleApiKey}
                  className="w-full"
                >
                  {loading ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Importing...
                    </>
                  ) : (
                    "Import from Google Places"
                  )}
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-red-600">Danger Zone</CardTitle>
              <CardDescription>Destructive operations</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border p-4 rounded-md">
                  <div>
                    <h3 className="font-medium">Delete All Businesses</h3>
                    <p className="text-sm text-muted-foreground">
                      This will permanently delete all businesses in the database
                    </p>
                  </div>
                  <Button variant="destructive" disabled={loading} onClick={handleImport}>
                    <Trash className="mr-2 h-4 w-4" />
                    Delete All
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="border-t py-8">
        <div className="container mx-auto px-4 md:px-6 lg:px-8 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Fulshear Local Admin. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
} 