import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/app/contexts/AuthContext";
import Loader from "@/app/components/loader/loader";
import { Suspense } from "react";
import { SnackbarProvider } from "@/app/contexts/SnackbarContext";
import ReduxProvider from "@/store/redux-provider";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Task Manager",
  description: "Task prioritization and status tracking.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Suspense fallback={<Loader />}>
          <ReduxProvider>
            <SnackbarProvider>
              <AuthProvider>{children}</AuthProvider>
            </SnackbarProvider>
          </ReduxProvider>
        </Suspense>
      </body>
    </html>
  );
}
