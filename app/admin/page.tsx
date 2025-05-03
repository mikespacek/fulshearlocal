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
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";

// Define the type for the import result
interface ImportResult {
  success: boolean;
  message: string;
  results?: {
    successful: number;
    skipped: number;
    failed: number;
    totalProcessed: number;
    deleteMode: string;
    lastImportDate: string;
  };
}

export default function AdminPage() {
  const [googleApiKey, setGoogleApiKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ImportResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  // Import options
  const [deleteExisting, setDeleteExisting] = useState(false);
  const [daysToLookBack, setDaysToLookBack] = useState(30);
  
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
      
      const importResult = await importPlaces({ 
        googleApiKey, 
        deleteExisting, 
        daysToLookBack 
      });
      
      setResult(importResult as ImportResult);
    } catch (err) {
      setError(`Error: ${err instanceof Error ? err.message : "Unknown error occurred"}`);
    } finally {
      setLoading(false);
    }
  };
  
  // Handle delete all businesses
  const handleDeleteAll = async () => {
    if (!window.confirm("Are you sure you want to delete ALL businesses? This cannot be undone.")) {
      return;
    }
    
    try {
      setLoading(true);
      setError(null);
      
      // Use the import function with deleteExisting=true but no API key to just perform deletion
      const dummy = "dummy-key-not-used"; // This won't be used since we're just deleting
      await importPlaces({ 
        googleApiKey: dummy, 
        deleteExisting: true,
        daysToLookBack: 0
      });
      
      setResult({
        success: true,
        message: "All businesses have been deleted from the database",
        results: {
          successful: 0,
          skipped: 0,
          failed: 0,
          totalProcessed: 0,
          deleteMode: "Deleted all",
          lastImportDate: new Date().toISOString()
        }
      });
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
                  {businesses && businesses.length > 0 && (
                    <div className="mt-4 pt-4 border-t">
                      <h3 className="text-sm font-medium mb-2">Businesses by Category:</h3>
                      <div className="space-y-1">
                        {categories && categories.map(category => {
                          const count = businesses.filter(business => 
                            business.categoryId === category._id
                          ).length;
                          return (
                            <div key={category._id} className="flex items-center justify-between">
                              <span className="text-xs text-muted-foreground">{category.name}:</span>
                              <span className="text-xs font-medium">{count}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  )}
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
                  
                  <div className="pt-4 border-t">
                    <h3 className="text-sm font-medium mb-3">Import Options</h3>
                    
                    <div className="flex items-center justify-between mb-4">
                      <div className="space-y-0.5">
                        <Label htmlFor="delete-existing" className="text-sm">
                          Replace Existing Businesses
                        </Label>
                        <p className="text-xs text-muted-foreground">
                          {deleteExisting 
                            ? "All existing businesses will be deleted before import" 
                            : "New businesses will be added to existing ones"}
                        </p>
                      </div>
                      <Switch 
                        id="delete-existing" 
                        checked={deleteExisting}
                        onCheckedChange={setDeleteExisting}
                      />
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center justify-between">
                        <Label htmlFor="days-lookback" className="text-sm">
                          Days to Look Back: {daysToLookBack}
                        </Label>
                      </div>
                      <Slider 
                        id="days-lookback"
                        min={7} 
                        max={180} 
                        step={1}
                        value={[daysToLookBack]} 
                        onValueChange={(values: number[]) => setDaysToLookBack(values[0])}
                      />
                      <p className="text-xs text-muted-foreground">
                        Prioritize places added in the last {daysToLookBack} days
                      </p>
                    </div>
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
                          <div className="mt-2 space-y-1">
                            <p>Added: {result.results.successful}</p>
                            {result.results.skipped !== undefined && (
                              <p>Skipped (already in database): {result.results.skipped}</p>
                            )}
                            <p>Failed: {result.results.failed}</p>
                            <p>Mode: {result.results.deleteMode}</p>
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
                  <Button variant="destructive" disabled={loading} onClick={handleDeleteAll}>
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