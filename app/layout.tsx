import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { ClientLayout } from "./layouts/ClientLayout";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

import "./globals.css";
import "../public/assets/css/style.css";
import "../public/assets/css/custom.css";
import { Loader } from "@/components/Loader";
import Script from "next/script";

const inter = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "CarEvents",
  description: "CarEvents is a platform for car enthusiasts to share their passion for cars.",
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en">
      <body className={`${inter.className}`} suppressHydrationWarning={true}>
        {/* <Loader /> */}

        <SessionProvider session={session}>
          <NextTopLoader
            color="#b89855"
            showSpinner={false}
            showAtBottom
          />
          <ClientLayout>
            {children}
          </ClientLayout>
        </SessionProvider>

        <Script src="assets/js/lib/bootstrap.min.js" strategy="beforeInteractive" />
        <Script src="assets/js/plugins/progressbar-js/progressbar.min.js" strategy="beforeInteractive" />
        <Script src="assets/js/base.js" strategy="beforeInteractive" />
        <Script src="assets/js/custom.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
