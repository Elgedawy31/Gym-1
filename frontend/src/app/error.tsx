'use client';

import React from 'react';
import { Button } from '@/components/ui/button';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Optionally log the error
    console.error(error);
  }, [error]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center space-y-6 max-w-md p-6 bg-card rounded-lg shadow-xl">
        <div className="text-destructive text-6xl font-bold mb-4">
          Oops!
        </div>
        <h1 className="text-2xl font-semibold text-foreground mb-4">
          Something went wrong
        </h1>
        <p className="text-muted-foreground mb-6">
          We encountered an unexpected error. Don&apos;t worry, our team is on it.
        </p>
        <div className="flex flex-col space-y-4">
          <Button 
            onClick={() => reset()}
            variant="destructive"
            className="w-full"
          >
            Try Again
          </Button>
          <Button 
            onClick={() => window.location.href = '/'}
            variant="outline"
            className="w-full"
          >
            Go to Home
          </Button>
        </div>
        {process.env.NODE_ENV === 'development' && (
          <div className="mt-4 text-xs text-muted-foreground">
            <details>
              <summary>Error Details</summary>
              <pre className="text-left text-xs overflow-x-auto bg-muted p-2 rounded mt-2">
                {error.message}
              </pre>
            </details>
          </div>
        )}
      </div>
    </div>
  );
}
