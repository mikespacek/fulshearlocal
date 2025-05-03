"use client";

import { useState } from "react";
import { useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { Navbar } from "@/components/navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AlertCircle, CheckCircle2 } from "lucide-react";

export default function AdminPage() {
  const [adminKey, setAdminKey] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const refreshData = useMutation(api.refreshData.refreshBusinessData);

  const handleRefresh = async () => {
    if (!adminKey) {
      setMessage("Admin key is required");
      setStatus("error");
      return;
    }

    try {
      setStatus("loading");
      const result = await refreshData({ adminKey });
      setMessage(`Data refreshed successfully! Timestamp: ${new Date(result.timestamp).toLocaleString()}`);
      setStatus("success");
    } catch (error) {
      setMessage(`Error: ${error instanceof Error ? error.message : "Unknown error"}`);
      setStatus("error");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 container py-8">
        <div className="max-w-md mx-auto">
          <h1 className="text-3xl font-bold mb-8 text-center">Admin Area</h1>
          
          <div className="space-y-6">
            <div className="space-y-2">
              <h2 className="text-xl font-semibold">Refresh Business Data</h2>
              <p className="text-sm text-muted-foreground">
                This will trigger a refresh of all business data from Google Places API.
                This operation might take some time depending on the number of businesses.
              </p>
            </div>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Admin Key</label>
                <Input
                  type="password"
                  value={adminKey}
                  onChange={(e) => setAdminKey(e.target.value)}
                  placeholder="Enter admin key"
                />
              </div>
              
              <Button 
                onClick={handleRefresh} 
                disabled={status === "loading"}
                className="w-full"
              >
                {status === "loading" ? "Refreshing..." : "Refresh Data"}
              </Button>
              
              {status !== "idle" && (
                <div className={`p-4 rounded-md ${
                  status === "success" ? "bg-green-50 text-green-700" :
                  status === "error" ? "bg-red-50 text-red-700" : ""
                }`}>
                  <div className="flex items-start">
                    {status === "success" ? (
                      <CheckCircle2 className="h-5 w-5 mr-2 shrink-0" />
                    ) : status === "error" ? (
                      <AlertCircle className="h-5 w-5 mr-2 shrink-0" />
                    ) : null}
                    <p className="text-sm">{message}</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
      
      <footer className="border-t py-6 text-center text-sm text-muted-foreground">
        <p>&copy; {new Date().getFullYear()} Fulshear Local. All rights reserved.</p>
      </footer>
    </div>
  );
} 