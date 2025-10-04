import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6 max-w-md p-6 bg-card rounded-lg shadow-xl">
        <div className="text-destructive text-8xl font-bold mb-4">
          404
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-4">
          Page Not Found
        </h1>
        <p className="text-muted-foreground mb-6">
          Looks like you&apos;ve wandered off the workout path. 
          The page you&apos;re looking for doesn&apos;t exist or has been moved.
        </p>
        <div className="flex flex-col space-y-4">
          <Link href="/" className="w-full">
            <Button variant="default" className="w-full">
              Back to Home
            </Button>
          </Link>
        </div>
        <div className="mt-6 text-xs text-muted-foreground">
          Need help finding your way? 
          <Link href="/contact" className="ml-1 underline hover:text-primary">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
