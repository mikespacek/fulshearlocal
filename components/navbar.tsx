"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background shadow-sm">
      <div className="container mx-auto px-4 md:px-6 lg:px-8 flex h-16 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2">
            <Image 
              src="/logo 1.svg" 
              alt="Fulshear Local Logo" 
              width={120} 
              height={40}
              priority
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
              <Image 
                src="/logo 1.svg" 
                alt="Fulshear Local Logo" 
                width={100} 
                height={35}
                priority
              />
            </div>
            <nav className="flex flex-col px-6 py-8">
              <Link
                href="/"
                className="text-lg font-medium py-2 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/categories"
                className="text-lg font-medium py-2 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Categories
              </Link>
              <Link
                href="/map"
                className="text-lg font-medium py-2 hover:text-blue-600 transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Map
              </Link>
            </nav>
          </SheetContent>
        </Sheet>

        {/* Desktop menu */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Home
          </Link>
          <Link href="/categories" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Categories
          </Link>
          <Link href="/map" className="text-sm font-medium hover:text-blue-600 transition-colors">
            Map
          </Link>
        </nav>
      </div>
    </header>
  );
} 