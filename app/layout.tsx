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
    icon: [
      {
        url: "/Favicon.png",
        sizes: "500x500",
        type: "image/png",
      },
      {
        url: "/Favicon.png",
        sizes: "any",
        type: "image/png",
      },
    ],
    shortcut: "/Favicon.png",
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
        <link rel="icon" href="/Favicon.png" type="image/png" sizes="any" />
        <link rel="shortcut icon" href="/Favicon.png" type="image/png" />
        <link rel="apple-touch-icon" href="/Favicon.png" />
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
