import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import "./globals.css";
import "../public/assets/css/style.css";
import "../public/assets/css/custom.css";
import Script from "next/script";
import MainLayout from "./layouts/MainLayout";

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
      <body className={`${inter.className}`} suppressHydrationWarning={true}>
        <div id="loader">
          <div className="spinner-border text-primary" role="status"></div>
        </div>
        <MainLayout>
          {children}
        </MainLayout>
        <Script src="assets/js/lib/bootstrap.min.js" strategy="beforeInteractive" />
        <Script src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js" />
        <Script src="assets/js/plugins/splide/splide.min.js" strategy="beforeInteractive" />
        <Script src="assets/js/plugins/progressbar-js/progressbar.min.js" strategy="beforeInteractive" />
        <Script src="assets/js/base.js" strategy="beforeInteractive" />
        <Script src="assets/js/custom.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
