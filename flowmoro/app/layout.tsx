import type { Metadata } from "next";
import { Geist, Geist_Mono, Jua } from "next/font/google";
import SessionProviders from "@/components/auth/SessionProviders";
import { QueryProvider } from "@/components/layout/QueryProvider";
import "./globals.css";

const geistSans = Geist({ variable: "--font-geist-sans", subsets: ["latin"] });
const geistMono = Geist_Mono({ variable: "--font-geist-mono", subsets: ["latin"] });
const jua = Jua({ weight: "400", subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Flowmoro",
  description: "할일 체크 뽀모도로",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body className={`${geistSans.variable} ${geistMono.variable} ${jua.className} antialiased bg-blues-100`}>
        <SessionProviders>
          <QueryProvider>{children}</QueryProvider>
        </SessionProviders>
      </body>
    </html>
  );
}
