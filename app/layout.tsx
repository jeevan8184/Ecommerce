import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import UserProvider from "@/components/Auth/UserProvider";
import {loadStripe} from '@stripe/stripe-js'
import ReduxProvider from "@/lib/redux/ReduxProvider";

const inter = Inter({ subsets: ["latin"] });

interface RootLayoutProps {
  children:React.ReactNode
}

export const metadata: Metadata = {
  title: "Ecommerce website",
  description: "shop now",
};

const stripe=loadStripe(process.env.NEXT_PUBLIC_PUBLISH_KEY!);

export default function RootLayout({children}:RootLayoutProps) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <UserProvider>
          <ReduxProvider>
            {children}
          </ReduxProvider>
        </UserProvider>
      </body>
    </html>
  );
}
