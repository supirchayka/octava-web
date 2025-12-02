// src/app/layout.tsx
import type { Metadata } from "next";
import "./globals.css";
import { SiteHeader } from "@/components/layout/SiteHeader";
import { SiteFooter } from "@/components/layout/SiteFooter";

export const metadata: Metadata = {
  title: "Клиника OCTAVA",
  description: "Антивозрастная и эстетическая медицина",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="ru">
      <body className="bg-white text-[#1D2D44]">
        <SiteHeader />
        {children}
        <SiteFooter />
      </body>
    </html>
  );
}
