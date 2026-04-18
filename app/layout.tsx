import type { Metadata } from "next";
import { Inter, Poppins } from "next/font/google";

import "@/app/globals.css";
import { AppProviders } from "@/components/providers/app-providers";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap"
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["500", "600", "700"],
  display: "swap"
});

export const metadata: Metadata = {
  title: "AstroNexus Admin Panel",
  description: "Production-ready admin dashboard for AstroNexus."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" data-theme="cosmic" suppressHydrationWarning>
      <body className={`${inter.variable} ${poppins.variable} font-body text-foreground`}>
        <AppProviders>{children}</AppProviders>
      </body>
    </html>
  );
}
