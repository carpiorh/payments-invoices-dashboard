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
        url: "data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 180 180'><rect width='180' height='180' fill='%23FFE135'/><line x1='25' y1='160' x2='100' y2='20' stroke='%23000' stroke-width='14' stroke-linecap='round'/><text x='45' y='140' font-family='Arial' font-size='110' font-weight='900' fill='%23000' font-style='italic'>F</text></svg>",
        sizes: "any",
        type: "image/svg+xml",
      },
    ],
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
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
