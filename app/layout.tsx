import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { DataProvider } from "@/lib/client/DataContext";
import { PaymentProofProvider } from "@/lib/client/PaymentProofContext";
import { Shell } from "@/components/Shell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "FLAIR - Payments & Invoices",
  description: "Multi-platform payment and invoice tracking",
  icons: {
    icon: "/favicon.ico",
    apple: "/Favicon.png",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <head>
        <meta name="theme-color" content="#FFE135" />
      </head>
      <body className="min-h-full flex flex-col">
        <DataProvider>
          <PaymentProofProvider>
            <Shell>{children}</Shell>
          </PaymentProofProvider>
        </DataProvider>
      </body>
    </html>
  );
}
