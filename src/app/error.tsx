'use client';

import { useEffect } from 'react';
import { Button } from '@heroui/react';
import { RefreshCw, Home, AlertTriangle } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-6 max-w-md">
        <div className="mb-8">
          <div className="w-16 h-16 bg-danger/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle className="w-8 h-8 text-danger" />
          </div>
          
          <h1 className="text-2xl font-bold text-foreground mb-2">Something went wrong!</h1>
          <p className="text-default-600 mb-4">
            We encountered an unexpected error. Please try refreshing the page.
          </p>
          
          {process.env.NODE_ENV === 'development' && (
            <details className="text-left bg-content2 rounded-lg p-4 mb-4">
              <summary className="cursor-pointer font-medium text-sm">Error Details</summary>
              <pre className="text-xs mt-2 overflow-auto">
                {error.message}
              </pre>
            </details>
          )}
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={reset}
            color="primary"
            startContent={<RefreshCw size={20} />}
            className="font-medium"
          >
            Try Again
          </Button>
          
          <Button
            as="a"
            href="/"
            variant="bordered"
            startContent={<Home size={20} />}
            className="font-medium"
          >
            Go Home
          </Button>
        </div>
      </div>
    </div>
  );
}
