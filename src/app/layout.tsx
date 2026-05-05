import type { Metadata } from "next";
import { Space_Grotesk } from "next/font/google";
import "./globals.css";

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Sharkedutech - Hospitality Education Platform",
  description: "Integrated Hospitality Education and Job Portal",
};

import { Navbar } from "@/components/layout/Navbar";

import Providers from "@/components/providers/SessionProvider";

import { Toaster } from 'react-hot-toast';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={spaceGrotesk.className} suppressHydrationWarning={true}>
        <Providers>
          <Toaster position="top-center" reverseOrder={false} />
          <Navbar />
          {children}
        </Providers>
      </body>
    </html>
  );
}
