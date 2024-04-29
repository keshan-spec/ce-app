import type { Metadata } from "next";
import { Poppins } from "next/font/google";
import NextTopLoader from "nextjs-toploader";
import { ClientLayout } from "./layouts/ClientLayout";
import { auth } from "@/auth";
import { SessionProvider } from "next-auth/react";

import "../../public/assets/css/style.css";
import "../../public/assets/css/custom.css";
import "./globals.css";

import Script from "next/script";
// import OneSignal from 'react-onesignal';

const inter = Poppins({ subsets: ["latin"], weight: ["400", "500", "600", "700"] });

export const metadata: Metadata = {
  title: "CarEvents",
  description: "CarEvents is a platform for car enthusiasts to share their passion for cars.",
};

// async function initOneSignal() {
//   try {
//     await OneSignal.init({ appId: 'a4c4e8da-6b85-478f-a458-6a3a4c5ceb39' });

//     OneSignal.Notifications.addEventListener('click', async (e) => {
//       let clickData = await e.notification;
//     });

//     OneSignal.Notifications.requestPermission()
//       .then((value) => {
//         console.log('Notification permission granted', value);
//       });
//   } catch (error) {
//     console.error('Error initializing OneSignal', error);
//   }
// }

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();
  // await initOneSignal();

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
