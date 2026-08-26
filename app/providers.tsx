"use client";

import { VoteProvider } from "./context/VoteContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const socketUrl = process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001";

  return (
    <VoteProvider socketUrl={socketUrl}>
      {children}
    </VoteProvider>
  );
}