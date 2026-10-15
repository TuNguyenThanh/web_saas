"use client";

import { useEffect } from "react";
import { Button, ButtonLink } from "@/components/Button";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Hook for a real error-reporting service (Sentry, etc.).
    console.error(error);
  }, [error]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <p className="text-sm font-semibold text-brand-600 dark:text-brand-400">
        Something went wrong
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
        Unexpected error
      </h1>
      <p className="mt-3 max-w-md text-gray-600 dark:text-gray-400">
        An unexpected error occurred. You can try again, or head back home.
        {error.digest ? (
          <span className="mt-2 block font-mono text-xs text-gray-400">
            Ref: {error.digest}
          </span>
        ) : null}
      </p>
      <div className="mt-8 flex gap-3">
        <Button onClick={reset}>Try again</Button>
        <ButtonLink href="/" variant="secondary">
          Back home
        </ButtonLink>
      </div>
    </main>
  );
}
