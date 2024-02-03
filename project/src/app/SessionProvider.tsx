"use client";

// Session provider is used to wrap the components in the layout file
// Enables the usage of client and server-side sessions
import { SessionProvider } from "next-auth/react";

interface ProviderProps {
  children: React.ReactNode;
}

const Provider = ({ children }: ProviderProps) => {
  return <SessionProvider>{children}</SessionProvider>;
};

export default Provider;
