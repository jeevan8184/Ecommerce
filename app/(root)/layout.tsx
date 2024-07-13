import Navbar from "@/components/shared/Navbar";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import {Toaster} from 'react-hot-toast'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
    title: "Ecommerce website",
    description: "shop now",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <Toaster />
        <div className="flex flex-col h-full w-full">
            <Navbar />
            <div className=" pt-[70px] max-sm:pt-16">
              {children}
            </div>
        </div>
      </body>
    </html>
  );
}
