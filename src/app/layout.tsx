import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { ClientLayout } from "./layouts/ClientLayout";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
import "../../public/assets/css/style.css";
import "../../public/assets/css/custom.css";

import Script from "next/script";
import Providers from "./context/QueryClientProvider";

const inter = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "DriveLife",
  description: "Drive Life is a platform for car enthusiasts to share their passion for cars.",
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
        <NextTopLoader
          color="#b89855"
          showSpinner={false}
        />

        <Providers>
          <SessionProvider session={session}>
            {children}
          </SessionProvider>
        </Providers>

        <Script src="/assets/js/lib/bootstrap.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/plugins/progressbar-js/progressbar.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/base.js" strategy="beforeInteractive" />
        <Script src="/assets/js/custom.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
