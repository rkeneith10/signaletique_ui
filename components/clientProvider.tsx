"use client";

import { ReactNode } from 'react';
import { SessionProvider } from 'next-auth/react';
import { UserProvider } from '@/hooks/userContext';
import { AuthProv } from "@/layout/authProv";

export default function ClientProviders({ children }: { children: ReactNode }) {
  return (
    <SessionProvider>
      <UserProvider>
        <AuthProv>
          {children}
        </AuthProv>
      </UserProvider>
    </SessionProvider>
  );
}
