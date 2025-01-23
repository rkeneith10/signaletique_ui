"use client";

import { SessionProvider } from "next-auth/react";
import AutoLogoutHandler from '../components/autoLogOutHandler';

export const AuthProv = ({ children }) => {
  return <SessionProvider>
    <AutoLogoutHandler />
    {children}
    </SessionProvider>;
};