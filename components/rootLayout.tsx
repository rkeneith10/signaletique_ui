"use client";

import { AppSidebar } from "@/components/app-sidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Inter } from "next/font/google";
import { ProgressLoader } from "nextjs-progressloader";
import React from "react";

const inter = Inter({ subsets: ["latin"] });

interface LayoutProps {
  children: React.ReactNode;
  isAuthenticated: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, isAuthenticated }) => {
  return (
    <html lang="en">
      <body className={`bg-white ${inter.className}`}>
        <SidebarProvider>
          <div className="flex h-screen w-screen">
            {/* Sidebar */}
            <AppSidebar />

            {/* Content */}
            <div className="flex-1">
              <ProgressLoader color="#3B82F6" showSpinner={false} />
              <main className="flex flex-col w-full h-full">
                {isAuthenticated && (
                  <>
                    <SidebarTrigger className="text-blue-700" />
                    {children}
                  </>
                )}
                {!isAuthenticated && children}
              </main>
            </div>
          </div>
        </SidebarProvider>
      </body>
    </html>
  );
};

export default Layout;
