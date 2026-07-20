"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertCircle, RefreshCw } from "lucide-react";

interface ErrorBoundaryProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export function ErrorBoundary({ error, reset }: ErrorBoundaryProps) {
  useEffect(() => {
    // Log error for monitoring
    console.error("Error caught by boundary:", error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
        <div className="inline-flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
          <AlertCircle className="h-6 w-6 text-red-600" />
        </div>

        <h1 className="text-2xl font-bold text-gray-900 mb-2">
          Something went wrong
        </h1>

        <p className="text-gray-600 mb-6">
          {error.message || "An unexpected error occurred. Please try again."}
        </p>

        {process.env.NODE_ENV === "development" && error.digest && (
          <div className="mb-6 p-3 bg-gray-100 rounded text-sm text-gray-700 text-left">
            <p className="font-mono break-all">Error ID: {error.digest}</p>
          </div>
        )}

        <button
          onClick={() => reset()}
          className="inline-flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          <RefreshCw className="h-4 w-4" />
          Try Again
        </button>

        <p className="text-sm text-gray-500 mt-6">
          If the problem persists, please {" "}
          <Link href="/" className="text-indigo-600 hover:underline">
            go back home
          </Link>
        </p>
      </div>
    </div>
  );
}
