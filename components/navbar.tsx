"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";
import { subscribeToNewsletter } from '@/lib/newsletter';

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [subscribing, setSubscribing] = useState(false);
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    
    setSubscribing(true);
    
    try {
      const result = await subscribeToNewsletter(email);
      if (result.success) {
        setSubscribed(true);
        setEmail(''); // Clear the email input
        
        // Reset after 3 seconds to allow subscribing again
        setTimeout(() => {
          setSubscribed(false);
        }, 3000);
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error('Subscription error:', error);
      alert('Failed to subscribe. Please try again later.');
    } finally {
      setSubscribing(false);
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/FL - Logo.svg" 
              alt="Fulshear Local Logo" 
              width={120} 
              height={40}
              priority
              quality={100}
              className="h-10 w-auto"
            />
          </Link>
        </div>

        {/* Mobile menu */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon" className="h-10 w-10">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="p-0">
            <div className="px-6 py-4 border-b">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <Image 
                  src="/FL - Logo.svg" 
                  alt="Fulshear Local Logo" 
                  width={100} 
                  height={35}
                  priority
                  quality={100}
                  className="h-9 w-auto"
                />
              </Link>
            </div>
            <div className="flex flex-col px-6 py-8">
              {subscribed ? (
                <div className="flex items-center text-center space-x-2 bg-gray-100 rounded-lg p-4">
                  <p className="text-sm text-gray-700">
                    Thanks for subscribing! You&apos;ll receive our next update.
                  </p>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col gap-3">
                  <h3 className="text-lg font-medium mb-2">Subscribe to updates</h3>
                  <input 
                    type="email" 
                    placeholder="Your email address" 
                    className="px-4 py-2.5 rounded-md text-sm text-gray-700 w-full focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                    aria-label="Email address"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <button 
                    type="submit" 
                    className="px-6 py-2.5 bg-black hover:bg-gray-900 text-white rounded-md text-sm font-medium transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                    disabled={subscribing}
                  >
                    {subscribing ? "Subscribing..." : "Subscribe"}
                  </button>
                </form>
              )}
            </div>
          </SheetContent>
        </Sheet>

        {/* Desktop subscribe button */}
        <div className="hidden md:block">
          {subscribed ? (
            <div className="text-sm text-green-700 font-medium">
              Thanks for subscribing!
            </div>
          ) : (
            <form onSubmit={handleSubscribe} className="flex items-center gap-2">
              <input 
                type="email" 
                placeholder="Your email address" 
                className="px-3 py-1.5 rounded-md text-sm text-gray-700 w-56 focus:outline-none focus:ring-2 focus:ring-blue-500 border border-gray-300"
                aria-label="Email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Button 
                type="submit" 
                className="bg-black hover:bg-gray-900 text-white"
                disabled={subscribing}
              >
                {subscribing ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </header>
  );
} 