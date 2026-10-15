"use client";

import { SWRConfig } from "swr";
import type { ReactNode } from "react";
import { jsonFetcher } from "@/lib/fetcher";

/**
 * App-wide SWR configuration (the client data layer).
 *
 * `fallback` lets a Server Component seed the cache with data it already
 * fetched (e.g. the current user), so the first client render has no loading
 * flash and no duplicate request.
 */
export function SWRProvider({
  children,
  fallback = {},
}: {
  children: ReactNode;
  fallback?: Record<string, unknown>;
}) {
  return (
    <SWRConfig
      value={{
        fetcher: jsonFetcher,
        fallback,
        revalidateOnFocus: false,
        shouldRetryOnError: false,
      }}
    >
      {children}
    </SWRConfig>
  );
}
