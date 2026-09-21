import type { Metadata } from "next";
import { Montserrat, Playfair_Display } from "next/font/google";

import { QueryProvider } from "@/providers/query";

import "@/styles/globals.css";

const montserrat = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
});

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["400", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: "La Verte Home",
  description:
    "Homestay theo giờ, qua đêm hoặc theo ngày — layout scaffold từ stark-frontend, nội dung thay dần.",
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/icon.png", sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
  },
  // iOS ignores the manifest's name/display; these drive the home-screen label
  // and the standalone status bar.
  appleWebApp: {
    capable: true,
    title: "La Verte",
    statusBarStyle: "black-translucent",
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover" as const,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" suppressHydrationWarning>
      <body
        className={`${montserrat.variable} ${playfair.variable} antialiased`}
        suppressHydrationWarning
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
