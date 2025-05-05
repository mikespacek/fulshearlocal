import { Metadata } from 'next';
import { ReactNode } from 'react';

export const metadata: Metadata = {
  title: 'Debug Tools - Fulshear Local',
  description: 'Debug tools for Fulshear Local',
  robots: {
    index: false,
    follow: false,
  },
};

export default function DebugLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
    </div>
  );
} 