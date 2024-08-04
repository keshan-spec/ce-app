'use client';
import React, { useMemo } from "react";
import { usePathname } from "next/navigation";
import { footerLessPaths } from "@/hooks/useTopNav";
import dynamic from "next/dynamic";
import { PageProvider } from "../context/PageProvider";

const TopNav = dynamic(() => import('@/app/layouts/includes/TopNav'));
const Footer = dynamic(() => import('@/app/layouts/includes/Footer'));
const PullToRefreshContext = dynamic(() => import('@/app/layouts/includes/PullToRefresh'));

interface MainLayoutProps {
    children: React.ReactNode;
}

export default function MainLayout({ children }: MainLayoutProps) {
    const pathname = usePathname();
    const showFooter = useMemo(() => !footerLessPaths.some((path) => pathname.includes(path)), [pathname]);

    return (
        <PageProvider>
            <TopNav />

            <PullToRefreshContext>
                {children}
            </PullToRefreshContext>

            {showFooter && <Footer />}
        </PageProvider>
    );
}
