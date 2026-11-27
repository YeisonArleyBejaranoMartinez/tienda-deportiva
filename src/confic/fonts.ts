import { Geist, Geist_Mono, Bebas_Neue } from "next/font/google";
export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const titleFont = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
});
