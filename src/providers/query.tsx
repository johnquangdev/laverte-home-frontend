"use client";

import { useState } from "react";
import type { FC, ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const DEFAULT_QUERY_OPTIONS: ConstructorParameters<typeof QueryClient>[0] = {
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60,
      refetchOnWindowFocus: false,
      retry: 1,
    },
    mutations: {
      retry: 1,
    },
  },
};

type Props = {
  children: ReactNode;
};

export const QueryProvider: FC<Props> = ({ children }) => {
  const [queryClient] = useState(() => new QueryClient(DEFAULT_QUERY_OPTIONS));

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};
