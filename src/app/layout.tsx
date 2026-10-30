import type { Metadata } from "next";

import "./globals.css";
import { geistMono, geistSans } from "@/src/confic/fonts";
import Providers from "../components/providers/Providers";
export const metadata: Metadata = {
  title: "Teslo shop",
  description: "Una tienda virtual de productos",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
      <Providers>
        {children}
      </Providers>
      </body>
    </html>
  );
}
