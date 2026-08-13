import type { Metadata } from "next";
import { Fraunces, Outfit } from "next/font/google";

import { QueryProvider } from "@/providers/query";

import "@/styles/globals.css";

const outfit = Outfit({
  variable: "--font-outfit",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "500", "600", "700"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin", "latin-ext"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "La Verte Home | Homestay theo giờ · qua đêm · theo ngày",
  description:
    "Đặt homestay La Verte không cần tài khoản — thanh toán VietQR để giữ chỗ trong 15 phút.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${outfit.variable} ${fraunces.variable} antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
