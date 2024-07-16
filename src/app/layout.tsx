import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";
import "./globals.css";
// import "../../public/assets/js/plugins/pickadate/default.css";
// import "../../public/assets/js/plugins/pickadate/default.time.css";
// import "../../public/assets/js/plugins/pickadate/default.date.css";

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
        <Script src="/assets/js/lib/jquery-3.7.1.min.js" strategy="beforeInteractive" />
        <Script src="/assets/js/plugins/progressbar-js/progressbar.min.js" strategy="beforeInteractive" />
        {/* <Script src="/assets/js/plugins/pickadate/picker.js" strategy="beforeInteractive" /> */}
        {/* <Script src="/assets/js/plugins/pickadate/picker.date.js" strategy="beforeInteractive" /> */}
        {/* <Script src="/assets/js/plugins/pickadate/picker.time.js" strategy="beforeInteractive" /> */}
        {/* <Script src="https://cdnjs.cloudflare.com/ajax/libs/pickadate.js/3.5.3/picker.js" strategy="beforeInteractive" />
        <Script src="https://cdnjs.cloudflare.com/ajax/libs/pickadate.js/3.5.3/picker.date.js" strategy="beforeInteractive" /> */}
        <Script src="/assets/js/base.js" strategy="beforeInteractive" />
        <Script src="/assets/js/custom.js" strategy="beforeInteractive" />
      </body>
    </html>
  );
}
