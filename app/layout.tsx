import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
const inter = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "CarEvents",
  description: "CarEvents is a platform for car enthusiasts to share their passion for cars.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className}`}>
        {children}
      </body>
    </html>
  );
}
