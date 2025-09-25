import Link from 'next/link';
import { Button } from '@heroui/react';
import { Home, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="text-center px-6">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-foreground mb-2">Page Not Found</h2>
          <p className="text-default-600 max-w-md mx-auto">
            The page you're looking for doesn't exist or has been moved.
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            as={Link}
            href="/"
            color="primary"
            startContent={<Home size={20} />}
            className="font-medium"
          >
            Go Home
          </Button>
          
          <Button
            as={Link}
            href="javascript:history.back()"
            variant="bordered"
            startContent={<ArrowLeft size={20} />}
            className="font-medium"
          >
            Go Back
          </Button>
        </div>
      </div>
    </div>
  );
}
